const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  login,
  logout,
  registration,
  refresh,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  registration
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh", refresh);
router.post("/forgot", body("email").isEmail(), forgotPassword);
router.post(
  "/reset",
  body("token").isString().isLength({ min: 10 }),
  body("password").isLength({ min: 3, max: 32 }),
  resetPassword
);

module.exports = router;
