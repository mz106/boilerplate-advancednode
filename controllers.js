const loginSuccessRedirectToProfile = async (req, res) => {
  console.log("hello from login success");

  if (!req.user) {
    console.log("user not here!!!");
  }
  res.redirect("/profile");
};

const renderProfile = async (req, res) => {
  res.render("profile");
};

const loginUser = async (req, res) => {};

module.exports = {
  loginSuccessRedirectToProfile,
  renderProfile,
};
