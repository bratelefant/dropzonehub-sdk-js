import { DropzoneOptions, CreateDropzoneParams } from './types';

export class Dropzone {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: DropzoneOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://www.collect-files.com/api';
    this.apiKey = options.apiKey;
  }

  /**
   * Create a new dropzone (requires API key)
   */
  async create(params: CreateDropzoneParams) {
    if (!this.apiKey) {
      throw new Error('API Key is required to create a dropzone.');
    }

    const res = await fetch(`${this.baseUrl}/dropzones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...params, apiKey: this.apiKey }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create dropzone: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * Get details of a dropzone
   */
  async get(id: string) {
    const res = await fetch(`${this.baseUrl}/dropzones/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to get dropzone: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * List files in a dropzone
   */
  async listFiles(id: string) {
    const res = await fetch(`${this.baseUrl}/dropzones/${id}/files`);

    if (!res.ok) {
      throw new Error(`Failed to list files: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * Upload files to a dropzone
   */
  async uploadFiles(id: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const res = await fetch(`${this.baseUrl}/dropzones/${id}/files`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }

  /**
   * Download a file (returns Blob)
   */
  async downloadFile(dropzoneId: string, fileId: string): Promise<Blob> {
    const res = await fetch(`${this.baseUrl}/dropzones/${dropzoneId}/files/${fileId}`);

    if (!res.ok) {
      throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    }

    return res.blob();
  }

  /**
   * Delete a file from a dropzone
   */
  async deleteFile(dropzoneId: string, fileId: string) {
    const res = await fetch(`${this.baseUrl}/dropzones/${dropzoneId}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }
}