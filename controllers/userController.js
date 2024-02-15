import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import emailWithNodemailer from "../helper/sendEmail.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

/**
 * @DESC Get all users data
 * @ROUTE /api/v1/user
 * @method GET
 * @access public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find().populate("role");

  if (users.length > 0) {
    res.status(200).json(users);
  }
});

/**
 * @DESC Get Single users data
 * @ROUTE /api/v1/user/:id
 * @method GET
 * @access public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const options = { password: 0 };
  const user = await User.findById(id, options);

  if (!user) {
    return res.status(404).json({ message: "User data not found" });
  }

  res.status(200).json(user);
});

/**
 * @DESC Create new User
 * @ROUTE /api/v1/user
 * @method POST
 * @access public
 */
export const createUser = asyncHandler(async (req, res) => {
  // get values
  const { name, email, password, role } = req.body;

  // validations
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // email check
  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return res.status(400).json({ message: "This Email already exists." });
  }

  // hash password
  const hashPass = await bcrypt.hash(password, 10);

  // create new user
  const user = await User.create({
    name,
    email,
    role,
    password: hashPass,
  });

  await user.populate("role");
  res.status(200).json({ user, message: `Account created for ${name}` });

  // mail to new user
  const emailData = {
    email,
    subject: "Account Access Details",
    html: `<h5>Hi ${name}, Welcome to our company</h5>
    <br>
    <strong>You are now a member of our Dashboard. Here is your Login Deails</strong>
    <br>
    |--------------------------------

    <p>Username : ${email}</p>
    <p>Username : ${password}</p>

    --------------------------------|
    <br>
    <strong>You can change your password anytime from your Profile. Thank You</strong>
    `,
  };
  await emailWithNodemailer(emailData);
});

/**
 * @DESC Delete User
 * @ROUTE /api/v1/user/:id
 * @method DELETE
 * @access public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(200).json({ user, message: "User Successfully Deleted" });
});

/**
 * @DESC Update User Profile
 * @ROUTE /api/v1/user/:id
 * @method PUT/PATCH
 * @access private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    name,
    gender,
    birthDate,
    mobile,
    address,
    city,
    state,
    country,
    zipcode,
  } = req.body;

  const image = req.file;

  const loggedInUser = req.me;
  const user = await User.findOne({ email: loggedInUser.email });

  const id = user._id;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      mobile,
      gender,
      address,
      city,
      state,
      country,
      zipcode,
      birthDate,
      photo: image?.filename,
    },
    { new: true }
  );

  res.status(200).json({ message: "user updated successfully", updatedUser });
});

/**
 * @DESC Update User
 * @ROUTE /api/v1/user-update/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUser = asyncHandler(async (req, res) => {
  try {
    

    const { id } = req.params;
    const { name, role, password } = req.body;

    if (!name || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashPass = bcrypt.hashSync(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        role : role,
        password: hashPass,
      }
    );

    const emailData = {
      email : user.email,
      subject: "Admin just updated your login access",
      html: `<h5>Hi ${name}, Welcome DOCCURE</h5>
    <br>
    <strong>Here is your new Login Deails</strong>
    <br>
    |--------------------------------

    <p>Username : ${user.email}</p>
    <p>Username : ${password}</p>

    --------------------------------|
    <br>
    <strong>You can change your password anytime from your Profile. Thank You</strong>
    `,
    };

    await emailWithNodemailer(emailData);

    res.status(200).json({ message: "user updated successfully", user });

  } catch (error) {
    console.log(error)
  }
});

/**
 * @DESC Update User
 * @ROUTE /api/v1/user/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "user status updated successfully", user });
});
