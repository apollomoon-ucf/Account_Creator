// routes for the different pages
const express = require("express");

const router = express.Router();

// go to the page on the forward slash, run this function with a reqeust
// and a response.
// Request: want to grab data from a form.
// Response: what you want to send to the front end.

// get home page
router.get("/", (req, res) => {
  // res.send("<h1>Home Page</h1>");
  // routing to handlebars page
  res.render("index");
});

// get login page
router.get("/login", (req, res) => {
  // routing to handlebars page
  res.render("login");
});

// get register page
router.get("/register", (req, res) => {
  // routing to handlebars page
  res.render("register");
});

// get profile page
router.get("/profile", (req, res) => {
  // routing to handlebars page
  res.render("profile", {
    message: "TEST",
  });
});

// factorial function
// function factorial(num) {
//   if (num < 0) return -1;
//   else if (num == 0) return 1;
//   else return num * factorial(num - 1);
// }

module.exports = router;
