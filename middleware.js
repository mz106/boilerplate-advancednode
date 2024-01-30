const passport = require("passport");

const authWithPassport = async (req, res) => {
  passport.authenticate("local", {
    failureRedirect: "/",
    message: "Hello from failure",
  });
  return;
};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = {
  authWithPassport,
  ensureAuthenticated,
};
