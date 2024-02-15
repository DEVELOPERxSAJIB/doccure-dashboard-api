import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { createSlug } from "../helper/createSlug.js";
import { cloudDelete, cloudUpload, cloudUploads } from "../utility/cloudUpload.js";
import { publicId } from "../helper/CloudinaryPublicId.js";

/**
 * @DESC Get all products data
 * @ROUTE /api/v1/product
 * @method GET
 * @access private
 */
export const getAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();

  if (product.length === 0) {
    return res.status(404).json({ message: "product data not found" });
  }

  if (!product) {
    return res.status(404).json({ message: "Failed to load products" });
  }

  res.status(200).json({ product, message: "All product data" });
});

/**
 * @DESC Get Single products data
 * @ROUTE /api/v1/product/:id
 * @method GET
 * @access private
 */
export const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  res.status(200).json(product);
});

/**
 * @DESC Create new product
 * @ROUTE /api/v1/product
 * @method POST
 * @access private
 */
export const createProduct = asyncHandler(async (req, res) => {
  // get values
  const {
    name,
    productType,
    productSimple,
    productVariable,
    productGroup,
    productExternal,
    shortDesc,
    longDesc,
  } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "products name is required" });
  }

  // exists product
  const productExists = await Product.findOne({ name });

  if (productExists) {
    return res.status(400).json({ message: "This product already exists" });
  }

  // file uploads
  let productPhotos = []
  if(req.files) {
    for (let i = 0; i < req.files.length; i++) {
      const photos = await cloudUploads(req.files[i].path)
      productPhotos.push(photos)
    }
  }

  if(productType === "simpleProduct") {
    await Product.create()
  }

  console.log(productPhotos);

  // create new product
  const product = await Product.create({
    name,
    slug: createSlug(name),
    productType,
    productSimple: productType === "simple" ? JSON.parse(productSimple) : null,
    productVariable: productType === "variable" ? productVariable : null,
    productGroup: productType === "group" ? productGroup : null,
    productExternal: productType === "external" ? productExternal : null,
    shortDesc,
    longDesc,
  });

  res.status(200).json({ message: "product created.", product });
});

/**
 * @DESC Delete product
 * @ROUTE /api/v1/product/:id
 * @method DELETE
 * @access private
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (product.logo) {
    const public_id = publicId(product.logo);
    cloudDelete(public_id);
  }

  res.status(200).json({ message: "product deleted", product });
});

/**
 * @DESC Update product
 * @ROUTE /api/v1/product/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const productUpdate = await Product.findById(id);

  if (!productUpdate) {
    return res.status(404).json("Product not found");
  }

  let updateProductLogo = productUpdate.logo;

  if (req.file) {
    let newLogo = await cloudUpload(req);
    updateProductLogo = newLogo.secure_url;
  }

  productUpdate.name = name;
  productUpdate.slug = createSlug(name);
  productUpdate.logo = updateProductLogo;
  await productUpdate.save();

  res
    .status(200)
    .json({ message: "product updated successfully", product: productUpdate });
});

/**
 * @DESC Update product Status
 * @ROUTE /api/v1/product/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const product = await product.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ message: "product updated successfully", product });
});
