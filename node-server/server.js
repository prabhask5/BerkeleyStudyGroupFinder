const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./routes/auth");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const InitiateMongoServer = require("./config/db.config");
const PORT = process.env.PORT || 4000;

InitiateMongoServer();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/*
 * Method - *
 */
app.use("/auth", auth);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});