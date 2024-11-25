const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
  },
});

const upload = multer({ storage: storage });
const {
  handleGetAllUsers,
  handleGetUserById,
  handleUpdateUserById,
  handleDeleteUserById,
  handleCreateNewUser,
  handleGetAllUsersJson,
  handleGetUserByIdJson,
} = require("../controllers/user");
//Routes

//Html View
router
  .route("/")
  .get(handleGetAllUsers)
  .post(upload.single("addImage"), handleCreateNewUser);

//For api request
router.route("/api").get(handleGetAllUsersJson);
router.route("/api/:id").get(handleGetUserByIdJson);
//For api request
router
  .route("/:id")
  .get(handleGetUserById)
  .patch(upload.single("uploadImage"), handleUpdateUserById)
  .delete(handleDeleteUserById);

// Define the route for image upload
router.route("/upload").post(upload.single("image"), (req, res) => {
  console.log("req.body : ", req.body, "req.file : ", req.file);
  return res.redirect("/users");
});
module.exports = router;
