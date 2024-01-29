"use strict";
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const myDB = require("./connection");
const { ObjectID } = require("mongodb");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views/pug");

fccTesting(app); //For FCC testing purposes

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.route("/").get((req, res) => {
//   res.render("index", { title: "Hello", message: "Please log in" });
// });

myDB(async (client) => {
  try {
    const myDataBase = await client.db("FCCAdvanceNode").collection("users");

    await app.route("/").get((req, res) => {
      res.render("index", {
        title: "Connected to database",
        message: "Please login",
      });
    });

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
      myDataBase.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        done(null, doc);
      });
      done(null, null);
    });
  } catch (error) {
    app.route("/").get((req, res) => {
      res.render("index", {
        title: e,
        message: "Unable to connect to database",
      });
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
