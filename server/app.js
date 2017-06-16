const express = require("express");
const path = require("path");
const app = express();

const socketio = require("socket.io");
const socket = require("./sockets");

module.exports = app;

// Serve static files from ../public
app.use(express.static(path.join(__dirname, "..", "public")));

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log("Listening on port", port);
});

const io = socketio(server);
socket(io);
