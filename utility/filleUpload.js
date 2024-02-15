import multer from "multer";

const storage = multer.memoryStorage();
export const brandLogo = multer({ storage }).single("brand-logo");
export const categoryPhoto = multer({ storage }).single("category-photo");

const storageV2 = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "_" + Math.floor(Math.random() * 100000) + "_" + file.filename
    );
  },
});

export const productPhotos = multer({ storage : storageV2 }).array("product-photos")