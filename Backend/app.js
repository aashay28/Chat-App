const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userRoutes = require("./Routes/userRoutes");
const messagesRoute = require("./Routes/messagesRoutes");
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// ROUTES
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

module.exports = app;
