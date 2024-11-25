const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    UID: {
      type: String,
      required: true,
      unique: true, // Ensure each UID is unique
    },
    firstName: {
      type: String,
      required: true,
      trim: true, // Remove any extra spaces
      default: "John",
    },
    lastName: {
      type: String,
      trim: true,
      default: "Doe",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Restrict to specific values
      default: "Other", // Default to 'Other' if not specified
    },
    age: {
      type: Number,
      default: 20,
      min: 1, // Minimum age 1
      max: 120, // Maximum age 120
    },
    designation: {
      type: String,
      trim: true,
      default: "Not Assigned",
    },
    phone: {
      type: Number,
      default: 1234567890,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validate phone number (10 digits)
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      unique: true, // Ensure email is unique
      lowercase: true, // Store email in lowercase
      default: "UnAvailable@gmai.com",
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v); // Validate email format
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/236x/db/1f/9a/db1f9a3eaca4758faae5f83947fa807c.jpg", // Default image URL if none is provided
    },
  },
  { timestamps: true }
);

// Index for frequently queried fields (UID, email)
// userSchema.index({ UID: 1, email: 1 });

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
