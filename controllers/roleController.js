import asyncHandler from "express-async-handler";
import Role from "../models/Role.js";
import { createSlug } from "../helper/createSlug.js";

/**
 * @DESC Get all Roles data
 * @ROUTE /api/v1/Role
 * @method GET
 * @access private
 */
export const getAllRole = asyncHandler(async (req, res) => {
  const role = await Role.find();

  if (role.length === 0) {
    return res.status(404).json({ message: "Role data not found" });
  }

  if (!role) {
    return res.status(404).json({ message: "Failed to load roles" });
  }

  res.status(200).json(role);
});

/**
 * @DESC Get Single Roles data
 * @ROUTE /api/v1/Role/:id
 * @method GET
 * @access private
 */
export const getSingleRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findById(id);

  if (role > 0) {
    res.status(200).json(role);
  }
});

/**
 * @DESC Create new Role
 * @ROUTE /api/v1/Role
 * @method POST
 * @access private
 */
export const createRole = asyncHandler(async (req, res) => {
  // get values
  const { name, permissions } = req.body;

  // validations
  if (!name) {
    return res.status(400).json({ message: "Roles name is required" });
  }

  // exists Role
  const roleExists = await Role.findOne({ name });

  if (roleExists) {
    return res.status(400).json({ message: "This Role already exists" });
  }

  // create new Role
  const role = await Role.create({
    name,
    permissions,
    slug: createSlug(name),
  });

  res.status(200).json({ message: "Role created.", role });
});

/**
 * @DESC Delete Role
 * @ROUTE /api/v1/Role/:id
 * @method DELETE
 * @access private
 */
export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const role = await Role.findByIdAndDelete(id);

  res.status(200).json({ message: "Role deleted", role });
});

/**
 * @DESC Update Role
 * @ROUTE /api/v1/Role/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  const updatedRole = await Role.findByIdAndUpdate(
    id,
    {
      name,
      permissions,
      slug: createSlug(name),
    },
    { new: true }
  );

  res.status(200).json({ message: "Role updated successfully", updatedRole });
});

/**
 * @DESC Update Role Status
 * @ROUTE /api/v1/role/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateRoleStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const role = await Role.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );

  res.status(200).json({ message: "Role updated successfully", role });
});
