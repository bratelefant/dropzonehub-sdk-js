<a name="DropzoneClient"></a>

## DropzoneClient
**Kind**: global class  

* [DropzoneClient](#DropzoneClient)
    * [new DropzoneClient(options)](#new_DropzoneClient_new)
    * [.getApiKeyInfo()](#DropzoneClient+getApiKeyInfo) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.transferGbMonths(toApiKey, gbMonths)](#DropzoneClient+transferGbMonths) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.createApiKey()](#DropzoneClient+createApiKey) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.createDropzone(params)](#DropzoneClient+createDropzone) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getDropzone(dropzoneId)](#DropzoneClient+getDropzone) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.listFiles(dropzoneId)](#DropzoneClient+listFiles) ⇒ <code>Promise.&lt;Array&gt;</code>
    * [.uploadFile(dropzoneId, file)](#DropzoneClient+uploadFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getFile(fileId)](#DropzoneClient+getFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.isUploaded(fileId)](#DropzoneClient+isUploaded) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.downloadFile(fileId)](#DropzoneClient+downloadFile) ⇒ <code>Promise.&lt;Blob&gt;</code>
    * [.deleteFile(fileId)](#DropzoneClient+deleteFile) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getFileUrl(fileId)](#DropzoneClient+getFileUrl) ⇒ <code>string</code>
    * [.getDropzonePermissions(dropzoneId)](#DropzoneClient+getDropzonePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.grantDropzonePermissions(dropzoneId, apiKey, permissions)](#DropzoneClient+grantDropzonePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.revokeDropzonePermissions(dropzoneId, apiKey, permissions)](#DropzoneClient+revokeDropzonePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.getFilePermissions(fileId)](#DropzoneClient+getFilePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.grantFilePermissions(fileId, apiKey, permissions)](#DropzoneClient+grantFilePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.revokeFilePermissions(fileId, apiKey, permissions)](#DropzoneClient+revokeFilePermissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>

<a name="new_DropzoneClient_new"></a>

### new DropzoneClient(options)
DropzoneClient class for interacting with the Dropzone API.
This class provides methods to create, manage, and interact with dropzones.
It supports creating dropzones, uploading files, listing files, downloading files,
and deleting files.

All requests need an API key for authentication, which can be provided in the options.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for the client. |
| [options.baseUrl] | <code>string</code> | The base URL for the API. |
| [options.apiKey] | <code>string</code> | The API key for authentication (required for some operations that consume gb-months that you've charged). |

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
  apiKey: "your-users-api-key" // Store this in your users object
});

// Upload a file to the dropzone
const file = new File(["content"], "example.txt", { type: "text/plain" });
const uploadedFile = await client.uploadFile("your-dropzone-id", file);
console.log("File uploaded:", uploadedFile);
```
<a name="DropzoneClient+getApiKeyInfo"></a>

### dropzoneClient.getApiKeyInfo() ⇒ <code>Promise.&lt;Object&gt;</code>
Get information about the API key.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The API key information.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.

<a name="DropzoneClient+transferGbMonths"></a>

### dropzoneClient.transferGbMonths(toApiKey, gbMonths) ⇒ <code>Promise.&lt;Object&gt;</code>
Transfer GB months to another API key.
This is useful for managing storage across different API keys.

Do not use this method on the client-side, as it requires an API key that has the `apikey.create` role.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The result of the transfer operation.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.


| Param | Type | Description |
| --- | --- | --- |
| toApiKey | <code>string</code> | The API key to transfer GB months to. |
| gbMonths | <code>number</code> | The number of GB months to transfer. |

<a name="DropzoneClient+createApiKey"></a>

### dropzoneClient.createApiKey() ⇒ <code>Promise.&lt;Object&gt;</code>
Create a new API key.
Use this method to create new API keys for users of your own application.
You can transfer GB months to this API key using the `transferGbMonths` method
to enable them to create their own dropzones.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The created API key object.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.

<a name="DropzoneClient+createDropzone"></a>

### dropzoneClient.createDropzone(params) ⇒ <code>Promise.&lt;Object&gt;</code>
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

<a name="DropzoneClient+getDropzone"></a>

### dropzoneClient.getDropzone(dropzoneId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get details of the dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The dropzone details.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | The ID of the dropzone to retrieve details for. |

<a name="DropzoneClient+listFiles"></a>

### dropzoneClient.listFiles(dropzoneId) ⇒ <code>Promise.&lt;Array&gt;</code>
List files in the dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - An array of file objects in the dropzone.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | The ID of the dropzone to list files for. |

<a name="DropzoneClient+uploadFile"></a>

### dropzoneClient.uploadFile(dropzoneId, file) ⇒ <code>Promise.&lt;Object&gt;</code>
Upload a file to the dropzone. Internally, the file is uploaded in three steps:
First, a presigned URL is requested.
Then the file is uploaded to that URL.
After the upload, the file metadata is confirmed.

All dropzone owners will be granted the file.own role for the file.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The uploaded file details.  
**Throws**:

- <code>Error</code> If the request fails or if the dropzone ID is not set.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | The ID of the dropzone to upload the file to. |
| file | <code>File</code> | The file to upload. |

<a name="DropzoneClient+getFile"></a>

### dropzoneClient.getFile(fileId) ⇒ <code>Promise.&lt;Object&gt;</code>
Get details of a file in a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The file details.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to retrieve. |

<a name="DropzoneClient+isUploaded"></a>

### dropzoneClient.isUploaded(fileId) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check if a file is uploaded in a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if the file is uploaded, false otherwise.  
**Throws**:

- <code>Error</code> If the request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to check. |

<a name="DropzoneClient+downloadFile"></a>

### dropzoneClient.downloadFile(fileId) ⇒ <code>Promise.&lt;Blob&gt;</code>
Download a file (returns Blob).

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Blob&gt;</code> - The file as a Blob.  
**Throws**:

- <code>Error</code> If the download fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to download. |

<a name="DropzoneClient+deleteFile"></a>

### dropzoneClient.deleteFile(fileId) ⇒ <code>Promise.&lt;Object&gt;</code>
Delete a file from a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The response from the server.  
**Throws**:

- <code>Error</code> If the delete request fails.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to delete. |

<a name="DropzoneClient+getFileUrl"></a>

### dropzoneClient.getFileUrl(fileId) ⇒ <code>string</code>
Get the URL for a file in a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>string</code> - The URL for the file.  

| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to get the URL for. |

<a name="DropzoneClient+getDropzonePermissions"></a>

### dropzoneClient.getDropzonePermissions(dropzoneId) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get current permissions for the dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The permissions for the dropzone.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the dropzone ID is not provided.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | The ID of the dropzone to get permissions for. |

<a name="DropzoneClient+grantDropzonePermissions"></a>

### dropzoneClient.grantDropzonePermissions(dropzoneId, apiKey, permissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Grant permissions for a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The updated permissions for the dropzone.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the dropzone ID or permissions are not provided.
- <code>Error</code> If the API key is not valid.
- <code>Error</code> If the permissions are not valid.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | Id of the dropzone to grant permissions for. |
| apiKey | <code>string</code> | Target API key to grant permissions to. |
| permissions | <code>Array.&lt;string&gt;</code> | Permissions to grant. Cf. https://www.collect-files.com/docs |

<a name="DropzoneClient+revokeDropzonePermissions"></a>

### dropzoneClient.revokeDropzonePermissions(dropzoneId, apiKey, permissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Revoke permissions for a dropzone.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The updated permissions for the dropzone.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the dropzone ID or permissions are not provided.


| Param | Type | Description |
| --- | --- | --- |
| dropzoneId | <code>string</code> | Id of the dropzone to revoke permissions for. |
| apiKey | <code>string</code> | Target API key to revoke permissions from. |
| permissions | <code>Array.&lt;string&gt;</code> | Permissions to revoke. Cf. https://www.collect-files.com/docs |

<a name="DropzoneClient+getFilePermissions"></a>

### dropzoneClient.getFilePermissions(fileId) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Get current permissions for the file.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The permissions for the file.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the file ID is not provided.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to get permissions for. |

<a name="DropzoneClient+grantFilePermissions"></a>

### dropzoneClient.grantFilePermissions(fileId, apiKey, permissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Grant permissions for a file.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The updated permissions for the file.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the file ID or permissions are not provided.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to grant permissions for. |
| apiKey | <code>string</code> | The API key to grant permissions to. |
| permissions | <code>Array.&lt;string&gt;</code> | The permissions to grant. Available permissions cf. https://www.collect-files.com/docs |

<a name="DropzoneClient+revokeFilePermissions"></a>

### dropzoneClient.revokeFilePermissions(fileId, apiKey, permissions) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Revoke permissions for a file.

**Kind**: instance method of [<code>DropzoneClient</code>](#DropzoneClient)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The updated permissions for the file.  
**Throws**:

- <code>Error</code> If the API key is not provided or if the request fails.
- <code>Error</code> If the file ID or permissions are not provided.


| Param | Type | Description |
| --- | --- | --- |
| fileId | <code>string</code> | The ID of the file to revoke permissions for. |
| apiKey | <code>string</code> | The API key to revoke permissions from. |
| permissions | <code>Array.&lt;string&gt;</code> | The permissions to revoke. Available permissions cf. https://www.collect-files.com/docs |

