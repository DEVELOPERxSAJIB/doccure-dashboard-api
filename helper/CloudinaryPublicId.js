// get public_id from secure_url
export const publicId = (url) => {
  return url.split("/")[url.split("/").length - 1].split(".")[0];
};
