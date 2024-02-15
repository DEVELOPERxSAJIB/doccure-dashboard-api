import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  updateBrandStatus,
} from "../controllers/brandController.js";
import { brandLogo } from "../utility/filleUpload.js";

// init router
const router = express.Router();

// user verify token
router.use(verifyToken);

// create route
router.route("/").get(getAllBrand).post(brandLogo, createBrand);
router
  .route("/:id")
  .get(getSingleBrand)
  .delete(deleteBrand)
  .put(brandLogo, updateBrand)
  .patch(updateBrand);
router.put("/status/:id", updateBrandStatus)

// export default router
export default router;
