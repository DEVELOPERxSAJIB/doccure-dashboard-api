import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
  updatePermissionStatus,
} from "../controllers/permissionController.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllPermission).post(createPermission);
router
  .route("/:id")
  .get(getSinglePermission)
  .delete(deletePermission)
  .put(updatePermission)
  .patch(updatePermission);
router.patch("/status/:id", updatePermissionStatus)

// export default router
export default router;
