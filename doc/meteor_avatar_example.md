
# 📦 Example: Using collect-files-sdk in Meteor

This example shows **minimal Meteor integration** for collect-files.com:

✅ Create a new user and assign a dedicated dropzone (server)  
✅ Allow the client to upload an avatar image to that dropzone  
✅ Store the returned file ID on the user document

---

## 🧭 Overview

- When a new user registers, the server **creates a dropzone** using your API key.  
- The dropzone ID is stored *directly on the user document* (root-level).  
- On the client, the user can upload a new avatar image.  
- The returned file ID is stored in `profile.avatarFileId` via a simple client-side update.

---

## 1️⃣ Server-side Method: Create User with Dropzone

**/imports/api/users/methods.js**

```javascript
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Dropzone } from 'collect-files-sdk';

const dzClient = new Dropzone({ apiKey: Meteor.settings.collectFilesApiKey });

Meteor.methods({
  async 'user.createWithDropzone'(email, password) {
    check(email, String);
    check(password, String);

    const userId = Accounts.createUser({ email, password });

    const result = await dzClient.create({ gb: 0.2, days: 365 });
    const dropzoneId = result.data._id;

    Meteor.users.update(userId, {
      $set: { avatarDropzoneId: dropzoneId },
    });

    return userId;
  },
});
```

✅ Requires API key on server  
✅ Saves dropzone ID directly on the user object

---

## 2️⃣ Client-side: Upload Avatar

Example React component:

```javascript
import React, { useState } from 'react';
import { Dropzone } from 'collect-files-sdk';
import { useTracker } from 'meteor/react-meteor-data';

const dzClient = new Dropzone(); // No API key needed

export default function AvatarUpload() {
  const user = useTracker(() => Meteor.user());
  const [uploading, setUploading] = useState(false);

  if (!user?.avatarDropzoneId) return <div>No Dropzone assigned.</div>;
  const dropzoneId = user.avatarDropzoneId;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await dzClient.uploadFiles(dropzoneId, [file]);
      const fileId = res.data.uploadedFiles[0]._id;

      Meteor.users.update(user._id, {
        $set: { 'profile.avatarFileId': fileId },
      });
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  const avatarUrl = user.profile?.avatarFileId
    ? dzClient.getFileUrl(user.profile.avatarFileId)
    : null;

  return (
    <div>
      {avatarUrl && <img src={avatarUrl} alt="Avatar" width={120} height={120} />}
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
    </div>
  );
}
```

✅ Uses stored dropzoneId to upload  
✅ Sets the returned fileId directly on the user document

---

## 3️⃣ Meteor.users Document Example

After setup:

```json
{
  "_id": "user123",
  "emails": [...],
  "avatarDropzoneId": "dropzone456",
  "profile": {
    "avatarFileId": "file789"
  }
}
```

✅ Dropzone ID at root-level  
✅ Avatar File ID in profile

---

## 🗺️ Security: Allow Rule

On server, allow clients to set their own avatarFileId:

```javascript
Meteor.users.allow({
  update(userId, doc, fields, modifier) {
    return userId === doc._id
      && fields.every(field => field.startsWith('profile.'));
  }
});
```

✅ Only the logged-in user can change their profile.avatarFileId

---

## ✅ Notes

- API key is *only* required server-side for creating dropzones.  
- Upload, list, download, delete require only the dropzoneId.  
- This pattern is perfect for user avatars or per-user file storage.

---

## 🧭 License

MIT

