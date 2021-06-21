//import mysql
const mysql = require("mysql");
// import jwt for web tokens
const jwt = require("jsonwebtoken");
// encrypting
const bcrypt = require("bcryptjs");
// start database
// to keep db in one place, maybe create a config js file with db in it, then import it with const db = require("./config/db");
const db = mysql.createPool({
  // socketpath from mamp for local, comment out with remote db
  // socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
  // working locally, otherwise put id address of the server
  // moved fields to .env file
  connectionLimit: 10,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: process.env.DATABASE,
});

// now connect database to app
// (commenting this out when connection to remote db fixed crashing)
// the correct fix is to use pooling: https://github.com/mysqljs/mysql#pooling-connections
// db.connect((error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Database Connection Successful :)");
//   }
// });

// login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", {
        message:
          "hmm, looks like you missed something..we need your email and password",
      });
    }
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        // console.log(results[0].password);
        if (
          !results ||
          !results[0] ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).render("login", {
            message: "sowwy, your email or password is incorrect :(",
          });
        } else {
          res.status(401).render("login", {
            message: "logged in! :)",
          });
          const id = results[0].user_id;
          const token = jwt.sign({ user_id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log("token:" + token);

          const cookieOptions = {
            expiresIn: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie("jwt", token, cookieOptions);
          res.status(200).redirect("/profile");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// register function
exports.register = async (req, res) => {
  console.log(req.body);
  try {
    //   const username = req.body.username;
    //   const email = req.body.email;
    //   const password = req.body.password;
    //   const password_confirm = req.body.password_confirm;
    //   same thing below but neater
    const { username, email, password, password_confirm } = req.body;

    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return res.render("register", {
            message: "email taken, try again..",
          });
        } else if (password !== password_confirm) {
          return res.render("register", {
            message: "sorry, passwords do not match",
          });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //   res.send("accepted");
        db.query(
          "INSERT INTO users SET ?",
          {
            username: username,
            email: email,
            password: hashedPassword,
          },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              return res.status(200).redirect("/login");
            }
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
  }
  //   res.send("submitted");
};

// plaid api function
// exports.plaid_post = async (req, res) => {
//   try {
//     // const { email, password } = req.body;
//     // Pull transactions for a date range
//     const response = await client
//       .getTransactions(accessToken, "2018-01-01", "2020-02-01", {})
//       .catch((err) => {
//         // handle error
//         console.log(error);
//       });
//     const transactions = response.transactions;
//     return res.status(400).render("profile", {
//       message: transactions,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
