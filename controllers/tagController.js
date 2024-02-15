import asyncHandler from "express-async-handler";
import Tag from "../models/Tag.js";
import { createSlug } from "../helper/createSlug.js";

/**
 * @DESC Get all tags data
 * @ROUTE /api/v1/tag
 * @method GET
 * @access private
 */
export const getAllTag = asyncHandler(async (req, res) => {
  const tag = await Tag.find();

  if (tag.length === 0) {
    return res.status(404).json({ message: "tag data not found" });
  }

  if (!tag) {
    return res.status(404).json({ message: "Failed to load tags" });
  }

  res.status(200).json({ tag });
});

/**
 * @DESC Get Single tags data
 * @ROUTE /api/v1/tag/:id
 * @method GET
 * @access private
 */
export const getSingleTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findById(id);

  res.status(200).json(tag);
});

/**
 * @DESC Create new tag
 * @ROUTE /api/v1/tag
 * @method POST
 * @access private
 */
export const createTag = asyncHandler(async (req, res) => {
  // get values
  const { name } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "tags name is required" });
  }

  // exists tag
  const tagExists = await Tag.findOne({ name });

  if (tagExists) {
    return res.status(400).json({ message: "This tag already exists" });
  }

  // create new tag
  const tag = await Tag.create({
    name,
    slug: createSlug(name),
  });

  res.status(200).json({ message: "New Tag created.", tag });
});

/**
 * @DESC Delete tag
 * @ROUTE /api/v1/tag/:id
 * @method DELETE
 * @access private
 */
export const deleteTag = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tag = await Tag.findByIdAndDelete(id);

  res.status(200).json({ message: "Tag deleted", tag });
});

/**
 * @DESC Update tag
 * @ROUTE /api/v1/tag/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateTag = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const tag = await Tag.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    { new: true }
  );

  res.status(200).json({ message: "tag updated successfully", tag });
});

/**
 * @DESC Update tag Status
 * @ROUTE /api/v1/tag/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateTagStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const tag = await Tag.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ message: "Tag Status changed", tag });
});
