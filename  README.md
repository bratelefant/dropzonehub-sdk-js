# dropzonehub-sdk-js

Official Node & Browser SDK for collect-files.com.

## ✨ Features
 - Zero-config usage
 - Works in Node, Browser, Meteor, React Native
 - Automatically targets the collect-files.com API

⸻

## 🚀 Installation
```bash
npm install dropzonehub
```

⸻

## 🎯 Basic Usage


### **Check the [full Meteor example right here](doc/meteor_avatar_example.md)!**


➜ 1️⃣ Server-side (create dropzones)

You need your API key only to create new dropzones.

```javascript
import { Dropzone } from 'dropzonehub';

const dz = new Dropzone({ apiKey: process.env.COLLECT_FILES_API_KEY });

const created = await dz.create({ gb: 1, days: 90 });
console.log('Dropzone ID:', created.data._id);
```

⸻

➜ 2️⃣ Client-side (no API key needed)

Everything else (upload, list, download, delete) is fully public with just the dropzone ID.

✅ Upload Avatar:
```javascript
import { Dropzone } from 'dropzonehub';

const dz = new Dropzone();

await dz.uploadFiles(dropzoneId, [file]);
```
✅ List Files:
```javascript
const files = await dz.listFiles(dropzoneId);
```
✅ Download:
```javascript
const blob = await dz.downloadFile(dropzoneId, fileId);
```
✅ Delete:
```javascript
await dz.deleteFile(dropzoneId, fileId);
```

⸻

## 🗺️ Typical Use Case (e.g. User Avatars)

✅ On signup (server):
	•	Create a dropzone with your API key
	•	Store dropzoneId on the user

✅ In your app (client):
	•	Use dropzoneId to upload the avatar
	•	Store returned fileId in user.profile.avatarFileId

⸻

## 🧭 Zero Config

✅ Defaults to https://www.collect-files.com/api
✅ No setup needed for upload/download/list/delete.
✅ API key only needed for dropzone creation.

⸻

## 📜 License

MIT