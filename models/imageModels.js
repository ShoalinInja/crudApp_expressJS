// models/imageModel.js

const path = require("path");

module.exports = class Image {
  constructor(imageUrl) {
    this.imageUrl = imageUrl;
  }

  static saveImage(file) {
    // Define the URL for the saved image (can be customized based on your requirements)
    return `/uploads/${file.filename}`;
  }
};
