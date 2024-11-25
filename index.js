const express = require("express");
const app = express();
const { connectMongoDB } = require("./connection");
const {
  logReqRes,
  parseJsonBody,
  parseUrlEncodedBody,
} = require("./middlewares");
const path = require("path");
const port = 8000;
const url = "mongodb://127.0.0.1:27017/crud-app";
const userRouter = require("./routes/user");
//Mongo Db connection
connectMongoDB(url).then(() => {
  console.log("Mongo Db Connected");
});
//Set EJS
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing request bodies
app.use(parseJsonBody); // Handle JSON payloads
app.use(parseUrlEncodedBody); // Handle URL-encoded form data

app.use(express.static(path.join(__dirname, "public")));
// Logging middleware
app.use(logReqRes("log.txt")); // Logs requests and responses to a file

//Routes
app.use("/users", userRouter);

app.listen(port, () => {
  console.log("Server Running...");
});
