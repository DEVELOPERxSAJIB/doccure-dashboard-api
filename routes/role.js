import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createRole,
  deleteRole,
  getAllRole,
  getSingleRole,
  updateRole,
  updateRoleStatus,
} from "../controllers/roleController.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllRole).post(createRole);
router
  .route("/:id")
  .get(getSingleRole)
  .delete(deleteRole)
  .put(updateRole)
  .patch(updateRole);
router.patch("/status/:id", updateRoleStatus)

// export default router
export default router;
