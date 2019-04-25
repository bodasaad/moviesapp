module.exports = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  if (!isLoggedIn) {
    res.render("login", {
      path: "/login",
      title: "Login",
      errmsg: 'Please login for being able to add movie in your list ',
      SuccessMessage: null
    });
  }
};
