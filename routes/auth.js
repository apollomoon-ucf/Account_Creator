// routes for the different pages
const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// get register page
router.post("/register", authController.register);

// get login page
router.post("/login", authController.login);

// get profile page
router.post("/profile", function (req, res) {
  res.render("profile", {
    factorial: factorial(5),
  });
});

// factorial function
function factorial(num) {
  if (num < 0) return -1;
  else if (num == 0) return 1;
  else return num * factorial(num - 1);
}

module.exports = router;
