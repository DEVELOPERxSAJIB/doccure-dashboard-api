import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  updateProductStatus,
} from "../controllers/productController.js";
import { productPhotos } from "../utility/filleUpload.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllProduct).post(productPhotos, createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .delete(deleteProduct)
  .put(updateProduct)
  .patch(updateProduct);
router.patch("/status/:id", updateProductStatus)

// export default router
export default router;
