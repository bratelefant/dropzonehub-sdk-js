<a name="DropzoneClient"></a>

## DropzoneClient
**Kind**: global class  

* [DropzoneClient](#DropzoneClient)
    * [new DropzoneClient(options)](#new_DropzoneClient_new)
    * [.create(params)](#DropzoneClient+create) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.get()](#DropzoneClient+get) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.listFiles()](#DropzoneClient+listFiles) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.uploadFile(file)](#DropzoneClient+uploadFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getFile(fileId)](#DropzoneClient+getFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.isUploaded(fileId)](#DropzoneClient+isUploaded) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.downloadFile(fileId)](#DropzoneClient+downloadFile) ⇒ <code>Promise.&lt;Blob&gt;</code>
    * [.deleteFile(fileId)](#DropzoneClient+deleteFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getFileUrl(fileId)](#DropzoneClient+getFileUrl) ⇒ <code>string</code>

<a name="new_DropzoneClient_new"></a>

### new DropzoneClient(options)
DropzoneClient class for interacting with the Dropzone API.
This class provides methods to create, manage, and interact with dropzones.
It supports creating dropzones, uploading files, listing files, downloading files,
and deleting files.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for the client. |
| [options.baseUrl] | <code>string</code> | The base URL for the API. |
| [options.apiKey] | <code>string</code> | The API key for authentication (required for some operations that consume gb-months that you've charged). |
| [options.dropzoneId] | <code>string</code> | dropzone ID, required for any operations that deal with a dropzone or files in a dropzone. |

**Example**  
```js
// This can run on your server-side code
const serversideClient = new DropzoneClient({
  baseUrl: "https://www.collect-files.com/api/v1",
  apiKey: "your-api-key"
});

const dropzone = await serversideClient.create({ gb: 1, days: 30 });

// This can run on your client-side code
const client = new DropzoneClient({
  baseUrl: "https://www.collect-files.com/api/v1",
  dropzoneId: "your-dropzone-id" // Optional, if you want to interact with a specific dropzone
});

// Upload a file to the dropzone
const file = new File(["content"], "example.txt", { type: "text/plain" });
const uploadedFile = await client.uploadFile(file);
console.log("File uploaded:", uploadedFile);
```
<a name="DropzoneClient+create"></a>

### dropzoneClient.create(params) ⇒ <code>Promise.&lt;Object&gt;</code>
Create a new dropzone (requires API key). This will consume gb-months that you've charged on your api key.
One month is counted as 30 days. So if you create a 1 GB dropzone for 30 days, it will consume 1 GB-month;
if you create a 0.5 GB dropzone for 60 days, it will also consume 1 GB-month.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The created dropzone object.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | Parameters for creating the dropzone. |
| params.gb | <code>number</code> | The size of the dropzone in GB. |
| params.days | <code>number</code> | The duration of the dropzone in days. |

<a name="DropzoneClient+get"></a>

### dropzoneClient.get() ⇒ <code>Promise.&lt;Object&gt;</code>
Get details of the dropzone. This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The dropzone details.  
**Throws**:

- <code>Error</code> If the request fails.

<a name="DropzoneClient+listFiles"></a>

### dropzoneClient.listFiles() ⇒ <code>Promise.&lt;Array&gt;</code>
List files in the dropzone. This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - An array of file objects in the dropzone.  
**Throws**:

- <code>Error</code> If the request fails.

<a name="DropzoneClient+uploadFile"></a>

### dropzoneClient.uploadFile(file) ⇒ <code>Promise.&lt;Object&gt;</code>
Upload a file to the dropzone. This requires a dropzone ID to be set in the client instance.
Internally, the file is uploaded in three steps:
First, a presigned URL is requested.
Then the file is uploaded to that URL.
After the upload, the file metadata is confirmed.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The uploaded file details.  
**Throws**:

- <code>Error</code> If the request fails or if the dropzone ID is not set.


| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | The file to upload. |

<a name="DropzoneClient+getFile"></a>

### dropzoneClient.getFile(fileId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get details of a file in a dropzone. This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The file details.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to retrieve. |

<a name="DropzoneClient+isUploaded"></a>

### dropzoneClient.isUploaded(fileId) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if a file is uploaded in a dropzone. This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if the file is uploaded, false otherwise.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to check. |

<a name="DropzoneClient+downloadFile"></a>

### dropzoneClient.downloadFile(fileId) ⇒ <code>Promise.&lt;Blob&gt;</code>
Download a file (returns Blob). This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Blob&gt;</code> - The file as a Blob.  
**Throws**:

- <code>Error</code> If the download fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to download. |

<a name="DropzoneClient+deleteFile"></a>

### dropzoneClient.deleteFile(fileId) ⇒ <code>Promise.&lt;Object&gt;</code>
Delete a file from a dropzone. This requires a dropzone ID to be set in the client instance.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The response from the server.  
**Throws**:

- <code>Error</code> If the delete request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to delete. |

<a name="DropzoneClient+getFileUrl"></a>

### dropzoneClient.getFileUrl(fileId) ⇒ <code>string</code>
Get the URL for a file in a dropzone. This is just a simple helper function.
This will not check in any way, if the file actually exists or is accessible.
This is a simple URL that can be used to access the file directly.
It is recommended to use this URL only after confirming that the file is uploaded and accessible

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>string</code> - The URL for the file.  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to get the URL for. |

