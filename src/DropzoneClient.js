const { isServer, warn, isDevelopment, log } = require("./lib");

// Define the API version
const host = "https://www.collect-files.com/api";
const version = "/v1";

/**
 * DropzoneClient class for interacting with the Dropzone API.
 * This class provides methods to create, manage, and interact with dropzones.
 * It supports creating dropzones, uploading files, listing files, downloading files,
 * and deleting files.
 * @class DropzoneClient
 * @param {Object} options - Configuration options for the client.
 * @param {string} [options.baseUrl] - The base URL for the API.
 * @param {string} [options.apiKey] - The API key for authentication (required for some operations that consume gb-months that you've charged).
 * @param {string} [options.dropzoneId] - dropzone ID, required for any operations that deal with a dropzone or files in a dropzone.
 *
 * @example
 * // This can run on your server-side code
 * const serversideClient = new DropzoneClient({
 *   baseUrl: "https://www.collect-files.com/api/v1",
 *   apiKey: "your-api-key"
 * });
 *
 * const dropzone = await serversideClient.create({ gb: 1, days: 30 });
 *
 * // This can run on your client-side code
 * const client = new DropzoneClient({
 *   baseUrl: "https://www.collect-files.com/api/v1",
 *   dropzoneId: "your-dropzone-id" // Optional, if you want to interact with a specific dropzone
 * });
 *
 * // Upload a file to the dropzone
 * const file = new File(["content"], "example.txt", { type: "text/plain" });
 * const uploadedFile = await client.uploadFile(file);
 * console.log("File uploaded:", uploadedFile);
 */
class DropzoneClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl ?? host + version; // this is subject to change to 'https://api.dropzonehub.com' in the future

    if (options.apiKey && !isServer) {
      isDevelopment &&
        warn("Keep your API key secret! Do not expose it in client-side code.");
    }
    if (!options.apiKey && !isServer) {
      isDevelopment &&
        warn(
          "You are using the DropzoneClient without an API key. This will limit functionality of the Client."
        );
    }

    this.apiKey = options.apiKey;
    this.dropzoneId = options.dropzoneId; // Optional dropzone ID for operations that require it
  }

  /**
   * Create a new dropzone (requires API key). This will consume gb-months that you've charged on your api key.
   * One month is counted as 30 days. So if you create a 1 GB dropzone for 30 days, it will consume 1 GB-month;
   * if you create a 0.5 GB dropzone for 60 days, it will also consume 1 GB-month.
   *
   * @param {Object} params - Parameters for creating the dropzone.
   * @param {number} params.gb - The size of the dropzone in GB.
   * @param {number} params.days - The duration of the dropzone in days.
   * @returns {Promise<Object>} The created dropzone object.
   * @throws {Error} If the API key is not provided or if the request fails.
   */
  async create({ gb, days }) {
    if (!this.apiKey) {
      throw new Error("API Key is required to create a dropzone.");
    }
    const res = await fetch(`${this.baseUrl}/dropzones`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": this.apiKey },
      body: JSON.stringify({ gb, days }),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to create dropzone: ${res.status} ${res.statusText}`
      );
    }

    return (await res.json()).data;
  }

  /**
   * Get details of the dropzone. This requires a dropzone ID to be set in the client instance.
   * @returns {Promise<Object>} The dropzone details.
   * @throws {Error} If the request fails.
   */
  async get() {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to get dropzone details. Please provide a dropzone ID when creating the client instance."
      );
    }
    const res = await fetch(`${this.baseUrl}/dropzone`, {
      method: "GET",
      headers: { "x-dropzone-id": this.dropzoneId },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get dropzone: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()).data;
  }

  /**
   * List files in the dropzone. This requires a dropzone ID to be set in the client instance.
   * @returns {Promise<Array>} An array of file objects in the dropzone.
   * @throws {Error} If the request fails.
   */
  async listFiles() {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to list files. Please provide a dropzone ID when creating the client instance."
      );
    }
    const res = await fetch(`${this.baseUrl}/files`, {
      method: "GET",
      headers: { "x-dropzone-id": this.dropzoneId },
    });
    if (!res.ok) {
      throw new Error(`Failed to list files: ${res.status} ${res.statusText}`);
    }
    return (await res.json()).data;
  }

  /**
   * Upload a file to the dropzone. This requires a dropzone ID to be set in the client instance.
   * Internally, the file is uploaded in three steps:
   * First, a presigned URL is requested.
   * Then the file is uploaded to that URL.
   * After the upload, the file metadata is confirmed.
   *
   * @param {File} file - The file to upload.
   * @returns {Promise<Object>} The uploaded file details.
   * @throws {Error} If the request fails or if the dropzone ID is not set.
   */
  async uploadFile(file) {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to upload files. Please provide a dropzone ID when creating the client instance."
      );
    }
    // First, request a presigned URL for the file
    log(`Requesting upload URL for file: ${file.name} (${file.size} bytes)`);
    const res = await fetch(`${this.baseUrl}/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dropzone-id": this.dropzoneId,
      },
      body: JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
      }),
    });
    if (!res.ok) {
      throw new Error(
        `Failed to request upload URL: ${res.status} ${res.statusText}`
      );
    }
    const result = await res.json();
    const { fileId, signedUrl } = result.data;
    if (!fileId || !signedUrl) {
      throw new Error("Invalid response from upload request.");
    }
    // Then, upload the file to the presigned URL
    log(`Uploading file to presigned URL: ${signedUrl}`);
    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error(
        `Failed to upload file: ${uploadRes.status} ${uploadRes.statusText}`
      );
    }
    // Finally, confirm the upload by updating the file metadata
    log(`Confirming upload for file ID: ${fileId}`);
    const updateRes = await fetch(`${this.baseUrl}/files/${fileId}/confirm`, {
      method: "POST",
      headers: {
        "x-dropzone-id": this.dropzoneId,
        "Content-Type": "application/json",
      },
    });
    if (!updateRes.ok) {
      throw new Error(
        `Failed to confirm upload: ${updateRes.status} ${updateRes.statusText}`
      );
    }
    log(`File uploaded successfully: ${fileId}`);
    return (await updateRes.json()).data;
  }

  /**
   * Get details of a file in a dropzone. This requires a dropzone ID to be set in the client instance.
   * @param {string} fileId - The ID of the file to retrieve.
   * @returns {Promise<Object>} The file details.
   * @throws {Error} If the request fails.
   */
  async getFile(fileId) {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to get file details. Please provide a dropzone ID when creating the client instance."
      );
    }
    const res = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: "GET",
      headers: { "x-dropzone-id": this.dropzoneId },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to get file details: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()).data;
  }

  /**
   * Check if a file is uploaded in a dropzone. This requires a dropzone ID to be set in the client instance.
   * @param {string} fileId - The ID of the file to check.
   * @returns {Promise<boolean>} True if the file is uploaded, false otherwise.
   * @throws {Error} If the request fails.
   */
  async isUploaded(fileId) {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to check file upload status. Please provide a dropzone ID when creating the client instance."
      );
    }
    const details = await this.getFile(fileId);
    return details.meta.s3Status === "uploaded";
  }

  /**
   * Download a file (returns Blob). This requires a dropzone ID to be set in the client instance.
   * @param {string} fileId - The ID of the file to download.
   * @returns {Promise<Blob>} The file as a Blob.
   * @throws {Error} If the download fails.
   */
  async downloadFile(fileId) {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to download files. Please provide a dropzone ID when creating the client instance."
      );
    }
    const res = await fetch(`${this.baseUrl}/files/${fileId}/download`, {
      headers: { "x-dropzone-id": this.dropzoneId },
    });
    if (!res.ok) {
      throw new Error(
        `Download of file ${fileId} failed: ${res.status} ${res.statusText}`
      );
    }
    return res.blob();
  }

  /**
   * Delete a file from a dropzone. This requires a dropzone ID to be set in the client instance.
   * @param {string} fileId - The ID of the file to delete.
   * @returns {Promise<Object>} The response from the server.
   * @throws {Error} If the delete request fails.
   */
  async deleteFile(fileId) {
    if (!this.dropzoneId) {
      throw new Error(
        "Dropzone ID is required to delete files. Please provide a dropzone ID when creating the client instance."
      );
    }

    const res = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: "DELETE",
      headers: { "x-dropzone-id": this.dropzoneId },
    });
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Get the URL for a file in a dropzone. This is just a simple helper function.
   * This will not check in any way, if the file actually exists or is accessible.
   * This is a simple URL that can be used to access the file directly.
   * It is recommended to use this URL only after confirming that the file is uploaded and accessible
   * @param {string} fileId - The ID of the file to get the URL for.
   * @returns {string} The URL for the file.
   */
  getFileUrl(fileId) {
    return `${this.baseUrl}/files/${fileId}`;
  }
}

module.exports = { DropzoneClient };
