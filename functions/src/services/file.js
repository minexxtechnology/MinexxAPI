const {drive} = require("../utils/connect");

const getFile = async (query)=>{
  if (query) {
    try {
      const files = await drive.files.list({
        q: `name = '${query}'`,
        pageSize: 1,
        spaces: `drive`,
      });

      if (files.data.files.length > 0) {
        drive.permissions.create({
          fileId: files.data.files[0].id,
          requestBody: {
            role: `reader`,
            type: `anyone`,
          },
        });

        return files.data.files[0].id;
      } else {
        return query;
      }
    } catch (err) {
      return err.message;
    }
  } else {
    return null;
  }
};

const getVideos = async ()=>{
  const list = [];

  const files = await drive.files.list({
    q: `name contains '.mp4'`,
    spaces: `drive`,
  });

  for (const file of files.data.files) {
    drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: `reader`,
        type: `anyone`,
      },
    });

    list.push({
      id: file.id,
      name: file.name,
    });
  }

  return list;
};

const getImages = async ()=>{
  const list = [];

  const files = await drive.files.list({
    q: "mimeType='image/jpeg'",
    spaces: `drive`,
  });

  for (const file of files.data.files) {
    drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: `reader`,
        type: `anyone`,
      },
    });
    list.push({
      id: file.id,
      name: file.name,
    });
  }

  return list;
};

const getDocuments = async ()=>{
  const list = [];

  const files = await drive.files.list({
    q: `name contains '.pdf'`,
    spaces: `drive`,
  });

  for (const file of files.data.files) {
    drive.permissions.create({
      fileId: file.id,
      requestBody: {
        role: `reader`,
        type: `anyone`,
      },
    });
    list.push({
      id: file.id,
      name: file.name,
    });
  }

  return list;
};

module.exports = {
  getFile,
  getVideos,
  getImages,
  getDocuments,
};
