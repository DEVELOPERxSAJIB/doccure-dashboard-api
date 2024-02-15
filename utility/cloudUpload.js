import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: "djdkjrlp8",
  api_key: "767212511153515",
  api_secret: "UouvfbLHI_yNUTaf_mroowujq9c",
});

export const cloudUpload = async (req) => {
  fs.writeFileSync("./" + req.file.originalname, req.file.buffer);

  const logo = await cloudinary.v2.uploader.upload(
    "./" + req.file.originalname,
    req.file.buffer
  );

  fs.unlinkSync("./" + req.file.originalname, req.file.buffer);

  return logo;
};

export const cloudUploads = async (path) => {
  const photos = await cloudinary.v2.uploader.upload(path);

  return photos.secure_url;
};

export const cloudDelete = async (publicId) => {
  await cloudinary.v2.uploader.destroy(publicId);
};
