const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./routes/auth");
const access = require("./routes/access");
const user = require("./routes/user");
const requests = require("./routes/requests");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const InitiateMongoServer = require("./config/db.config");
const InitiateTestData = require("./config/test.config");
const PORT = process.env.PORT || 4000;

InitiateMongoServer();
//InitiateTestData();

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
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
app.use("/access", access);
app.use("/user", user);
app.use("/requests", requests);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});