// import express so we can start our server from nodejs
const express = require("express");
// import path
const path = require("path");
//import mysql
const mysql = require("mysql");
// env
const dotenv = require("dotenv");
// import cookie parser
const cookieParser = require("cookie-parser");
// plaid
const plaid = require("plaid");
// telling app which port to listen on; using OR for webhosts that are using their own port (we're using 5000)
const PORT = process.env.PORT || 5000;

// point to env file
dotenv.config({ path: "./config.env" });
// make sure we start the server with this app
const app = express();
// // start database
// const db = mysql.createConnection({
//   // socketpath from mamp when local; comment out when running a remote db
//   // socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
//   // working locally, otherwise put id address of the server
//   // moved fields to .env file
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PWD,
//   database: process.env.DATABASE,
// });

// define public directory; any css, js for the front end that we might want to use. (__dirname gives current directory)
const public_directory = path.join(__dirname, "./public");
// allow express to user public directory
app.use(express.static(public_directory));

// parsing html - grab data from forms
app.use(express.urlencoded({ extended: false }));
// data as json
app.use(express.json());
// initialize cookie parser so we can use it the browser
app.use(cookieParser());

// setting up handlebars
app.set("view engine", "hbs");

// // now connect database to app
// db.connect((error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Database Connection Successful :)");
//   }
// });

// plaid
// const client = new plaid.Client({
//   clientID: process.env.PLAID_CLIENT_ID,
//   secret: process.env.PLAID_SECRET,
//   env: plaid.environments.sandbox,
// });

// define routes from pages.js
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// tell express which port you to listen to
app.listen(process.env.PORT || PORT, () =>
  console.log("Server Started. PORT: " + PORT)
);
