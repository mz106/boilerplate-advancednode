const passport = require("passport");

const authWithPassport = async (req, res) => {
  passport.authenticate("local", {
    failureRedirect: "/",
    message: "Hello from failure",
  });
  return;
};

module.exports = {
  authWithPassport,
};
