const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearerToken = req.header("Authentication").split(" ")[1];
  const bearerSign = req.header("Authorization").split(" ")[1];
  if (bearerToken == "undefined" || bearerSign == "undefined"){
    return res.status(203).json({ message: "Token does not exist" });
  }

  try {
    const decoded = jwt.verify(bearerToken + "." + bearerSign, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(201).send({ message: "Invalid Token" });
  }
};