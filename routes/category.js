import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/categoryController.js";
import { categoryPhoto } from "../utility/filleUpload.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllCategory).post(categoryPhoto, createCategory);
router
  .route("/:id")
  .get(getSingleCategory)
  .delete(deleteCategory)
  .put(categoryPhoto, updateCategory)
  .patch(categoryPhoto, updateCategory);
router.put("/status/:id", updateCategoryStatus);

// export default router
export default router;
