const fs = require("fs");
const path = require("path");
const express = require("express");

// Helper function to get a formatted timestamp
const getFormattedTimestamp = () => {
  return new Date().toISOString(); // Returns in ISO 8601 format
};

// Middleware to log requests and responses
function logReqRes(filename) {
  return async (req, res, next) => {
    const timestamp = getFormattedTimestamp();
    const logEntry = `${timestamp} | ${req.method} | ${
      req.path
    } | ${JSON.stringify(req.body)}\n`;

    try {
      // Append log to file asynchronously
      await fs.promises.appendFile(path.resolve(filename), logEntry);
    } catch (error) {
      console.error("Error logging request:", error);
    }

    // Log response status code after response is sent
    const originalSend = res.send;
    res.send = function (data) {
      const responseStatus = res.statusCode;
      const responseLog = `${timestamp} | Response Status: ${responseStatus}\n`;

      try {
        // Append response log to file
        fs.promises.appendFile(path.resolve(filename), responseLog);
      } catch (error) {
        console.error("Error logging response:", error);
      }

      // Call original res.send to send the response
      return originalSend.call(this, data);
    };

    next(); // Proceed to the next middleware or route handler
  };
}

// Middleware to parse JSON data
function parseJsonBody(req, res, next) {
  express.json()(req, res, next); // Uses express's built-in JSON parser
}

// Middleware to parse URL-encoded form data
function parseUrlEncodedBody(req, res, next) {
  express.urlencoded({ extended: false })(req, res, next); // Uses express's built-in URL-encoded parser
}

module.exports = {
  logReqRes,
  parseJsonBody,
  parseUrlEncodedBody,
};
