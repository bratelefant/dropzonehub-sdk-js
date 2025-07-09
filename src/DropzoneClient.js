const { isServer, warn, isDevelopment, log } = require("./lib");

/**
 * DropzoneClient class for interacting with the Dropzone API.
 * This class provides methods to create, manage, and interact with dropzones.
 * It supports creating dropzones, uploading files, listing files, downloading files,
 * and deleting files.
 * @class DropzoneClient
 * @param {Object} options - Configuration options for the client.
 * @param {string} [options.baseUrl] - The base URL for the API.
 * @param {string} [options.apiKey] - The API key for authentication (required for some operations that consume gb-months that you've charged).
 */
class DropzoneClient {
  /**
   * @param {Object} options - Configuration options for the client.
   * @param {string} [options.baseUrl] - The base URL for the API.
   * @param {string} [options.apiKey] - The API key for authentication. Don't pass this to the constructor if you are on the client-side.
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl ?? "https://www.collect-files.com/api"; // this is subject to change to 'https://api.dropzonehub.com' in the future

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
  }

  /**
   * Create a new dropzone (requires API key). This will consume gb-months that you've charged on your api key.
   * One month is counted as 30 days. So if you create a 1 GB dropzone for 30 days, it will consume 1 GB-month;
   * if you create a 0.5 GB dropzone for 60 days, it will also consume 1 GB-month.
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
   * Get details of a dropzone
   * @param {string} id - The ID of the dropzone to retrieve.
   * @returns {Promise<Object>} The dropzone details.
   * @throws {Error} If the request fails.
   */
  async get(id) {
    const res = await fetch(`${this.baseUrl}/dropzones/${id}`);
    if (!res.ok) {
      throw new Error(
        `Failed to get dropzone: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()).data;
  }

  /**
   * List files in a dropzone
   * @param {string} id - The ID of the dropzone to list files from.
   * @returns {Promise<Array>} An array of file objects in the dropzone.
   * @throws {Error} If the request fails.
   */
  async listFiles(id) {
    const res = await fetch(`${this.baseUrl}/dropzones/${id}/files`);
    if (!res.ok) {
      throw new Error(`Failed to list files: ${res.status} ${res.statusText}`);
    }
    return (await res.json()).data;
  }

  async uploadFile(dropzoneId, file) {
    // first, request a presigned URL for the file
    log(`Requesting upload URL for file: ${file.name} (${file.size} bytes)`);
    const res = await fetch(
      `${this.baseUrl}/dropzones/${dropzoneId}/upload/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
        }),
      }
    );
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
    // then, upload the file to the presigned URL
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
    // finally, confirm the upload by updating the file metadata
    log(`Confirming upload for file ID: ${fileId}`);
    const updateRes = await fetch(
      `${this.baseUrl}/files/${fileId}/upload/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
        }),
      }
    );
    if (!updateRes.ok) {
      throw new Error(
        `Failed to confirm upload: ${updateRes.status} ${updateRes.statusText}`
      );
    }
    log(`File uploaded successfully: ${fileId}`);
    return (await updateRes.json()).data;
  }

  /**
   * Get details of a file in a dropzone
   * @param {string} fileId - The ID of the file to retrieve.
   * @returns {Promise<Object>} The file details.
   * @throws {Error} If the request fails.
   */
  async getFile(fileId) {
    const res = await fetch(`${this.baseUrl}/files/${fileId}`);
    if (!res.ok) {
      throw new Error(
        `Failed to get file details: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()).data;
  }

  /**
   * Check if a file is uploaded in a dropzone
   * @param {string} fileId - The ID of the file to check.
   * @returns {Promise<boolean>} True if the file is uploaded, false otherwise.
   * @throws {Error} If the request fails.
   */
  async isUploaded(fileId) {
    const details = await this.getFile(fileId);
    return details.meta.s3Status === "uploaded";
  }

  /**
   * Download a file (returns Blob)
   * @param {string} dropzoneId - The ID of the dropzone.
   * @param {string} fileId - The ID of the file to download.
   * @returns {Promise<Blob>} The file as a Blob.
   * @throws {Error} If the download fails.
   */
  async downloadFile(dropzoneId, fileId) {
    const res = await fetch(`${this.baseUrl}/files/${fileId}/download`);
    if (!res.ok) {
      throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    }
    return res.blob();
  }

  /**
   * Delete a file from a dropzone
   * @param {string} dropzoneId - The ID of the dropzone.
   * @param {string} fileId - The ID of the file to delete.
   * @returns {Promise<Object>} The response from the server.
   * @throws {Error} If the delete request fails.
   */
  async deleteFile(dropzoneId, fileId) {
    const res = await fetch(
      `${this.baseUrl}/dropzones/${dropzoneId}/files/${fileId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Get the URL for a file in a dropzone. This will not check in any way, if the file actually exists or is accessible.
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
