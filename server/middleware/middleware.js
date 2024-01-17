const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const checkIfUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY_JWT, (err) => {
      if (err) {
        res.redirect("/admin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/admin");
  }
};

module.exports = { checkIfUser };
