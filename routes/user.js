import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
  updateUserProfile,
  updateUserStatus,
} from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";
import profilePhotoMulter from "../middlewares/multer.js";

const router = express.Router();
router.use(verifyToken);
// create route
router.route("/").get(getAllUser).post(createUser);
router
  .route("/:id")
  .get(getSingleUser)
  .delete(deleteUser)
  .patch(updateUserStatus);
router.put("/update-user", verifyToken, profilePhotoMulter, updateUserProfile);
router.patch("/user-update/:id", updateUser);

// export default router
export default router;
