# dropzonehub-sdk-js

Upload, download and manage files in the cloud in your meteorjs, nextjs, express, or any node and javascript app easily, with **dropzones**.

- Get your free api key - no account needed: [https://www.collect-files.com/devs](https://www.collect-files.com/devs)
- Use your api key with this sdk on your server to deliver **dropzones** to your client
- Upload, download and manage files in your **dropzone**

We use aws s3 for our service to store the files.

### On your server
```js
const serversideClient = new DropzoneClient({
  apiKey: "your-api-key"
});

const dropzone = await serversideClient.create({ gb: 1, days: 30 });
```

Send the `dropzone._id` to the client, e.g. by storing it in your users profile.

### On your client
```js
const dropzone = new DropzoneClient({
  dropzoneId: "your-dropzone-id"
});

// Upload a file to the dropzone
const file = new File(["content"], "example.txt", { type: "text/plain" });

// Do some fun stuff with your dropzone
const uploadedFile = await dropzone.uploadFile(file);
const downloadedFile = await dropzone.downloadFile(uploadedFile._id);
await dropzone.deleteFile(uploadedFile._id);
```

## Features
 - Zero-config usage
 - Works in Node, Browser, Meteor, React Native
 - Automatically targets the collect-files.com API

## Installation
```bash
npm install dropzonehub
```

## Docs
Check the [docs](docs/API.md)

## License

MIT
