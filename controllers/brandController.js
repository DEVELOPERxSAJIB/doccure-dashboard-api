import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import { createSlug } from "../helper/createSlug.js";
import { cloudDelete, cloudUpload } from "../utility/cloudUpload.js";
import { publicId } from "../helper/CloudinaryPublicId.js";

/**
 * @DESC Get all brands data
 * @ROUTE /api/v1/brand
 * @method GET
 * @access private
 */
export const getAllBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.find();

  if (brand.length === 0) {
    return res.status(404).json({ message: "brand data not found" });
  }

  if (!brand) {
    return res.status(404).json({ message: "Failed to load brands" });
  }

  res.status(200).json({ brand });
});

/**
 * @DESC Get Single brands data
 * @ROUTE /api/v1/brand/:id
 * @method GET
 * @access private
 */
export const getSingleBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  res.status(200).json(brand);
});

/**
 * @DESC Create new brand
 * @ROUTE /api/v1/brand
 * @method POST
 * @access private
 */
export const createBrand = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "brands name is required" });
  }

  // exists brand
  const brandExists = await Brand.findOne({ name });

  if (brandExists) {
    return res.status(400).json({ message: "This brand already exists" });
  }

  let mainLogo = null;

  if (req.file) {
    mainLogo = await cloudUpload(req);
  }

  // create new brand
  const brand = await Brand.create({
    name,
    slug: createSlug(name),
    logo: mainLogo ? mainLogo.secure_url : null,
  });

  res.status(200).json({ message: "Brand created.", brand });
});

/**
 * @DESC Delete brand
 * @ROUTE /api/v1/brand/:id
 * @method DELETE
 * @access private
 */
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);

  if (brand.logo) {
    const public_id = publicId(brand.logo);
    cloudDelete(public_id);
  }

  res.status(200).json({ message: "brand deleted", brand });
});

/**
 * @DESC Update brand
 * @ROUTE /api/v1/brand/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const brandUpdate = await Brand.findById(id);

  if (!brandUpdate) {
    return res.status(404).json("Brand not found");
  }

  let updateBrandLogo = brandUpdate.logo;

  if (req.file) {
    await cloudDelete(publicId(brandUpdate.logo));
    let newLogo = await cloudUpload(req);
    updateBrandLogo = newLogo.secure_url;
  }

  brandUpdate.name = name;
  brandUpdate.slug = createSlug(name);
  brandUpdate.logo = updateBrandLogo;
  await brandUpdate.save();

  res
    .status(200)
    .json({ message: "brand updated successfully", brand: brandUpdate });
});

/**
 * @DESC Update brand Status
 * @ROUTE /api/v1/brand/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateBrandStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ message: "Brand status updated", brand });
});
