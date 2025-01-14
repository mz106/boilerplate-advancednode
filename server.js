"use strict";
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const myDB = require("./connection");
const { ObjectID } = require("mongodb");
const fccTesting = require("./freeCodeCamp/fcctesting.js");

const LocalStrategy = require("passport-local");

const { loginSuccessRedirectToProfile } = require("./controllers");
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
        showLogin: true,
      });
    });

    await app.route("/login").post(
      passport.authenticate("local", {
        failureRedirect: "/",
        message: "Hello from failure",
      }),
      loginSuccessRedirectToProfile
    );

    app.route("/profile").get(ensureAuthenticated, (req, res) => {
      res.render("profile", { username: req.user.username });
    });

    app.route("/logout").get((req, res) => {
      req.logout();
      res.redirect("/");
    });

    app.use((req, res, next) => {
      res.status(404).type("text").send("Not Found");
    });

    passport.use(
      new LocalStrategy((username, password, done) => {
        myDataBase.findOne({ username: username }, (err, user) => {
          console.log(`User ${username} attempted to log in.`);
          if (err) return done(err);
          if (!user) return done(null, false);
          if (password !== user.password) return done(null, false);
          console.log("user in local strategy: ", user);
          return done(null, user);
        });
      })
    );

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

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
