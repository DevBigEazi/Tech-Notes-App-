const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// to read user's data, we need get request and then the route will be /user and the access is going to be private
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean(); // the lean method will help get only the json data from mongodb and ignore the extras. Also it queries the data faster

  // If there is no user in the database
  if (!users?.length)
    return res.status(400).json({ message: "No users found" });

  res.json(users);
});

// to create new user, we need post request and then the route will be /user and the access is going to be private
const createNewUser = asyncHandler(async (req, res) => {
  // destructure the data the request will receive
  const { username, password, roles } = req.body;

  //confirm the data
  if (!username || !password || !Array.isArray(roles) || !roles.length)
    return res.status(400).json({ message: "All fields are required" });

  // check duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate)
    return res.status(409).json({ message: "Username already exist" });

  // hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashPassword, roles });
  //create
  if (user)
    return res
      .status(201)
      .json({ message: `User ${username} added successfully` });
  else return res.status(400).json({ message: "Invalid user data received" });
});

// to update user, we will make use of patch request and then the route will be /user and the access is going to be private
const updateUser = asyncHandler(async (req, res) => {
  // destructure the data the request will receive
  const { id, username, password, roles, active } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required except password" });
  }
  // Does the user exist to update?
  const user = await User.findById(id).exec();
  if (!user) return res.status(400).json({ message: "User Not Found" });

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id)
    return res.status(400).json({ message: "Duplicate User" });

  //three fields to be updated
  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password); // salt rounds
  }

  const updatedUser = await user.save();
  res.json({ message: `User ${updatedUser} has been updated` });
});

// to delete user, we need delete request and then the route will be /user and the access is going to be private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  //confirm
  if (!id) res.status(400).json({ message: "User's ID is required" });

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) res.status(400).json({ message: "User has notes assigned" });

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) return res.status(400).json({ message: "User Not Found" });

  const deletedUser = await user.deleteOne();

  const reply = `User ${deletedUser.username} with ID ${deletedUser._id} has been deleted`;
  res.status(200).json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
