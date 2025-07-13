const { Errors } = require("./Errors");
const { log, isServer, warn } = require("./lib");

// Define the API version
const host = "https://www.collect-files.com/api";
const version = "/v1";

/**
 * DropzoneClient class for interacting with the Dropzone API.
 * This class provides methods to create, manage, and interact with dropzones.
 * It supports creating dropzones, uploading files, listing files, downloading files,
 * and deleting files.
 *
 * All requests need an API key for authentication, which can be provided in the options.
 * @class DropzoneClient
 * @param {Object} options - Configuration options for the client.
 * @param {string} [options.baseUrl] - The base URL for the API.
 * @param {string} [options.apiKey] - The API key for authentication (required for some operations that consume gb-months that you've charged).
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
 *   apiKey: "your-users-api-key" // Store this in your users object
 * });
 *
 * // Upload a file to the dropzone
 * const file = new File(["content"], "example.txt", { type: "text/plain" });
 * const uploadedFile = await client.uploadFile("your-dropzone-id", file);
 * console.log("File uploaded:", uploadedFile);
 */
class DropzoneClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl ?? host + version; // this is subject to change to 'https://api.dropzonehub.com' in the future
    this.apiKey = options.apiKey;
    if (!isServer) {
      warn(
        "You are not in a server env. Only use your API key on your own devices or server-side code."
      );
    }
  }

  checkApiKey() {
    if (!this.apiKey) {
      throw Errors[401];
    }
  }

  /**
   * Get information about the API key.
   * @returns {Promise<Object>} The API key information.
   * @throws {Error} If the API key is not provided or if the request fails.
   */
  async getApiKeyInfo() {
    this.checkApiKey();
    const res = await fetch(`${this.baseUrl}/apikeys/me`, {
      method: "GET",
      headers: { "x-api-key": this.apiKey },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return (await res.json()).data;
  }

  /**
   * Transfer GB months to another API key.
   * This is useful for managing storage across different API keys.
   *
   * Do not use this method on the client-side, as it requires an API key that has the `apikey.create` role.
   *
   * @param {string} toApiKey - The API key to transfer GB months to.
   * @param {number} gbMonths - The number of GB months to transfer.
   * @returns {Promise<Object>} The result of the transfer operation.
   * @throws {Error} If the API key is not provided or if the request fails.
   */
  async transferGbMonths(toApiKey, gbMonths) {
    this.checkApiKey();
    if (!toApiKey || !gbMonths) {
      throw Errors[400];
    }
    const res = await fetch(
      `${this.baseUrl}/apikeys/${toApiKey}/transfer-gbmonths`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({ gbMonths }),
      }
    );

    if (!res.ok) {
      throw Errors.resError(res);
    }

    return (await res.json()).data;
  }

  async createApiKey() {
    this.checkApiKey();
    const res = await fetch(`${this.baseUrl}/apikeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    });

    if (!res.ok) {
      throw Errors.resError(res);
    }

    return (await res.json()).data;
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
  async createDropzone({ gb, days }) {
    this.checkApiKey();
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
   * Get details of the dropzone.
   * @param {string} dropzoneId - The ID of the dropzone to retrieve details for.
   * @returns {Promise<Object>} The dropzone details.
   * @throws {Error} If the request fails.
   */
  async getDropzone(dropzoneId) {
    this.checkApiKey();
    if (!dropzoneId) {
      throw Errors[400];
    }
    const res = await fetch(`${this.baseUrl}/dropzones/${dropzoneId}`, {
      method: "GET",
      headers: { "x-api-key": this.apiKey },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return (await res.json()).data;
  }

  /**
   * List files in the dropzone.
   * @param {string} dropzoneId - The ID of the dropzone to list files for.
   * @returns {Promise<Array>} An array of file objects in the dropzone.
   * @throws {Error} If the request fails.
   */
  async listFiles(dropzoneId) {
    this.checkApiKey();
    if (!dropzoneId) {
      throw Errors[400];
    }
    const res = await fetch(`${this.baseUrl}/dropzones/${dropzoneId}/files`, {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey,
      },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return (await res.json()).data;
  }

  /**
   * Upload a file to the dropzone. Internally, the file is uploaded in three steps:
   * First, a presigned URL is requested.
   * Then the file is uploaded to that URL.
   * After the upload, the file metadata is confirmed.
   *
   * @param {string} dropzoneId - The ID of the dropzone to upload the file to.
   * @param {File} file - The file to upload.
   * @returns {Promise<Object>} The uploaded file details.
   * @throws {Error} If the request fails or if the dropzone ID is not set.
   */
  async uploadFile(dropzoneId, file) {
    this.checkApiKey();
    if (!dropzoneId) {
      throw Errors[400];
    }
    // First, request a presigned URL for the file
    log(`Requesting upload URL for file: ${file.name} (${file.size} bytes)`);
    const res = await fetch(`${this.baseUrl}/dropzones/${dropzoneId}/files`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        name: file.name,
        type: file.type,
        size: file.size,
      }),
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    const result = await res.json();
    const { fileId, signedUrl } = result.data;
    if (!fileId || !signedUrl) {
      throw Errors[400];
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
      throw Errors.resError(uploadRes);
    }
    // Finally, confirm the upload by updating the file metadata
    log(`Confirming upload for file ID: ${fileId}`);
    const updateRes = await fetch(`${this.baseUrl}/files/${fileId}/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    });
    if (!updateRes.ok) {
      throw Errors[400];
    }
    log(`File uploaded successfully: ${fileId}`);
    return (await updateRes.json()).data;
  }

  /**
   * Get details of a file in a dropzone.
   * @param {string} fileId - The ID of the file to retrieve.
   * @returns {Promise<Object>} The file details.
   * @throws {Error} If the request fails.
   */
  async getFile(fileId) {
    this.checkApiKey();
    const res = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: "GET",
      headers: { "x-api-key": this.apiKey },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return (await res.json()).data;
  }

  /**
   * Check if a file is uploaded in a dropzone.
   * @param {string} fileId - The ID of the file to check.
   * @returns {Promise<boolean>} True if the file is uploaded, false otherwise.
   * @throws {Error} If the request fails.
   */
  async isUploaded(fileId) {
    this.checkApiKey();
    const details = await this.getFile(fileId);
    return details.meta.s3Status === "uploaded";
  }

  /**
   * Download a file (returns Blob).
   * @param {string} fileId - The ID of the file to download.
   * @returns {Promise<Blob>} The file as a Blob.
   * @throws {Error} If the download fails.
   */
  async downloadFile(fileId) {
    this.checkApiKey();
    const res = await fetch(`${this.baseUrl}/files/${fileId}/download`, {
      headers: { "x-api-key": this.apiKey },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return res.blob();
  }

  /**
   * Delete a file from a dropzone.
   * @param {string} fileId - The ID of the file to delete.
   * @returns {Promise<Object>} The response from the server.
   * @throws {Error} If the delete request fails.
   */
  async deleteFile(fileId) {
    this.checkApiKey();

    const res = await fetch(`${this.baseUrl}/files/${fileId}`, {
      method: "DELETE",
      headers: { "x-api-key": this.apiKey },
    });
    if (!res.ok) {
      throw Errors.resError(res);
    }
    return res.json();
  }

  /**
   * Get the URL for a file in a dropzone.
   * @param {string} fileId - The ID of the file to get the URL for.
   * @returns {string} The URL for the file.
   */
  getFileUrl(fileId) {
    return `${this.baseUrl}/files/${fileId}`;
  }
}

module.exports = { DropzoneClient };
