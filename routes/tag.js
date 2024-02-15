import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createTag,
  deleteTag,
  getAllTag,
  getSingleTag,
  updateTag,
  updateTagStatus,
} from "../controllers/tagController.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllTag).post(createTag);
router
  .route("/:id")
  .get(getSingleTag)
  .delete(deleteTag)
  .put(updateTag)
  .patch(updateTag);
router.patch("/status/:id", updateTagStatus)

// export default router
export default router;