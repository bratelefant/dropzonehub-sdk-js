export interface DropzoneOptions {
  apiKey?: string;
  baseUrl?: string;
}

export interface CreateDropzoneParams {
  gb: number;
  days: number;
}

export interface FileItem {
  _id: string;
  name: string;
  size: number;
  type: string;
  meta?: {
    dropZoneId?: string;
    dropZoneCode?: string;
    createdAt?: string;
    s3Status?: string;
  };
}