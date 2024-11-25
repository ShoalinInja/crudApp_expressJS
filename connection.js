const mongoose = require("mongoose");

async function connectMongoDB(url) {
  console.log("Connecting to Mongo db");
  return mongoose.connect(url);
}

module.exports = {
  connectMongoDB,
};
