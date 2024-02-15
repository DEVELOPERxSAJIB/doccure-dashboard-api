import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import { createSlug } from "../helper/createSlug.js";
import { cloudDelete, cloudUpload } from "../utility/cloudUpload.js";
import { publicId } from "../helper/CloudinaryPublicId.js";

/**
 * @DESC Get all categorys data
 * @ROUTE /api/v1/category
 * @method GET
 * @access private
 */
export const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Category.find().populate([
    {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
        },
      },
    },
    {
      path: "subCategory",
      populate: {
        path: "subCategory",
        populate: {
          path: "subCategory",
        },
      },
    },
  ]);

  if (category.length === 0) {
    return res.status(404).json({ message: "category data not found" });
  }

  if (!category) {
    return res.status(404).json({ message: "Failed to load categorys" });
  }

  res.status(200).json({category});
});

/**
 * @DESC Get Single categorys data
 * @ROUTE /api/v1/category/:id
 * @method GET
 * @access private
 */
export const getSingleCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate([
    {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
        },
      },
    },
    {
      path: "subCategory",
      populate: {
        path: "subCategory",
        populate: {
          path: "subCategory",
        },
      },
    },
  ]);

  res.status(200).json(category);
});

/**
 * @DESC Create new category
 * @ROUTE /api/v1/category
 * @method POST
 * @access private
 */
export const createCategory = asyncHandler(async (req, res) => {
  // get values
  const { name, parentCategory, icon } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "categorys name is required" });
  }

  // exists category
  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    return res.status(400).json({ message: "This category already exists" });
  }

  let catIcon = null;
  if (icon) {
    catIcon = icon;
  }

  // photo upload
  let catPhoto = null;

  if (req.file) {
    const cat = await cloudUpload(req);
    catPhoto = cat.secure_url;
  }

  // create new category
  const category = await Category.create({
    name,
    slug: createSlug(name),
    parentCategory: parentCategory ? parentCategory : null,
    icon: catIcon ? catIcon : null,
    photo: catPhoto ? catPhoto : null,
  });

  if (parentCategory) {
    const parent = await Category.findByIdAndUpdate(parentCategory, {
      $push: { subCategory: category._id },
    });
  }

  res.status(200).json({ message: "Category created.", category });
});

/**
 * @DESC Delete category
 * @ROUTE /api/v1/category/:id
 * @method DELETE
 * @access private
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  // delete photo
  if (category.photo) {
    await cloudDelete(publicId(category.photo));
  }

  res.status(200).json({ message: "Category deleted", category });
});

/**
 * @DESC Update category
 * @ROUTE /api/v1/category/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, parentCategory, icon } = req.body;

  const categoryUpdate = await Category.findById(id);

  if (!categoryUpdate) {
    return res.json({ message: "category not found" });
  }

  // parent category update
  let updateParentCategory = categoryUpdate.parentCategory;
  if (parentCategory) {
    updateParentCategory = parentCategory;
  }

  // icon update
  let updateIcon = categoryUpdate.icon;
  if (icon) {
    updateIcon = icon;
  }

  // photo upload
  let updatedPhoto = categoryUpdate.photo
  if(req.file){
    await cloudDelete(publicId(categoryUpdate.photo)) 

    const photo = await cloudUpload(req)
    updatedPhoto = photo.secure_url
  }

  categoryUpdate.name = name;
  categoryUpdate.slug = createSlug(name);
  categoryUpdate.parentCategory = updateParentCategory;
  categoryUpdate.icon = updateIcon;
  categoryUpdate.photo = updatedPhoto;
  await categoryUpdate.save();

  res
    .status(200)
    .json({
      message: "category updated successfully",
      category: categoryUpdate,
    });
});

/**
 * @DESC Update category Status
 * @ROUTE /api/v1/category/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ message: "Category status updated", category });
});
