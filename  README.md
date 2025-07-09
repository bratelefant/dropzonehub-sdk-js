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