const User = require("../models/user");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

async function handleGetAllUsers(req, res) {
  const allUsers = await User.find({});
  res.render("home", { allUsers: allUsers });
}

async function handleGetAllUsersJson(req, res) {
  const allUsers = await User.find({});
  return res.json(allUsers);
}

async function handleGetUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User does not exist" });
  return res.render("profiles", { user: user });
}
async function handleGetUserByIdJson(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User does not exist" });
  return res.json(user);
}

async function handleUpdateUserById(req, res) {
  try {
    // Extract updated fields from the request body

    // req.file will contain the uploaded image
    console.log("Uploaded file: ", req.file); // This will show the image file details

    // req.body will contain the other fields
    console.log("Request Body: ", req.body); // This will show other data like first name, last name, etc.

    const { firstName, lastName, gender, age, designation, phone, email } =
      req.body;
    const { id } = req.params; // Get user ID from the URL params
    console.log("id: ", id); // This will show other data like first name, last name, etc.

    // Handle image
    let imagePath = null;
    if (req.file) {
      imagePath = `public/uploads/${req.file.filename}`; // Assuming static file serving is set up for `public`
    } else {
      imagePath =
        "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg"; // Default image URL
    }

    console.log("image path: ", imagePath); // This will show other data like first name, last name, etc.
    // Update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        age,
        gender,
        designation,
        phone,
        email,
        image: imagePath,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleDeleteUserById(req, res) {
  try {
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Delete user
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the event
    console.log(`User with ID ${req.params.id} deleted successfully`);

    // Return success response
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleCreateNewUser(req, res) {
  console.log("req.body:", req.body, "req.file:", req.file);

  const { UID, firstName, lastName, gender, age, designation, phone, email } =
    req.body;
  console.log("Body1 ", req.body);

  if (!UID || !firstName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const existingUser = await User.findOne({ UID: UID });
  if (existingUser) {
    return res.status(409).json({ error: "UID already exists" });
  }
  // Handle image
  let imagePath = null;
  if (req.file) {
    imagePath = `public/uploads/${req.file.filename}`; // Assuming static file serving is set up for `public`
  } else {
    imagePath =
      "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg"; // Default image URL
  }
  try {
    const result = await User.create({
      UID,
      firstName,
      lastName,
      gender,
      age,
      designation,
      phone: phone || 1234567890,
      email: email || "Unavailble@gmail.com",
      image: imagePath,
    });

    return res.status(201).redirect("/users");
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
}
module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
  handleGetAllUsersJson,
  handleGetUserByIdJson,
};
