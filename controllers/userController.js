const Movie = require("../models/Movies");
const User = require("../models/User");
const addToLikeMethod = require('../middlewares/addToLike');
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");

const transport = nodeMailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup", {
    title: "Sign Up",
    path: "/signup",
    isAuthenticated: false,
    errmsg: message,
    SuccessMessage: null,
    hasError: false,
    oldInputs: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "req.body.confirmPassword"
    }
  });
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());

    return res.status(422).render("signup", {
      path: "/signup",
      title: "Sign Up",
      isAuthenticated: false,
      SuccessMessage: null,
      errmsg: errors.array()[0].msg,
      hasError: true,
      oldInputs: {
        name: name,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      }
    });
  }

  return User.find({ email: email })
    .then(result => {
      if (result) {
        return res.status(422).render("signup", {
          title: "Sign Up",
          path: "/signup",
          isAuthenticated: false,
          errmsg:
            "Email Exsist Did You Forgot Your Password!!! Click The Link Below",
          SuccessMessage: null,
          hasError: true,
          oldInputs: {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
          }
        });
      }
      return crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          console.log(err);
          return res.redirect("/signup");
        }
        const token = buffer.toString("hex");
        bcrypt
          .hash(password, 12)
          .then(hashedpassword => {
            const user = new User({
              name: name,
              email: email,
              password: hashedpassword,
              likes: { item: [] },
              signUpToken: token
            });
            return user.save();
          })
          .then(result => {
            transport.sendMail({
              to: email,
              from: "HomeCinema-Team@mail.com",
              subject: "Successfully Signed Up...",
              html: `
            <p>We glad to be one of our commuinty one last step just click the link below to verify your account now</p>
            <p>Click <a href="http://localhost:3000/verfiy/${token}">HERE</a></p>
            `
            });
            return res.redirect("/");
          });
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getVerify = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ signUpToken: token })
    .then(result => {
      if (!result) {
        return res.redirect("/");
      }
      return res.render("verify", {
        path: "/Verfiy",
        title: "Verify Your Account",
        isAuthenticated: false,
        errmsg: null,
        SuccessMessage: null,
        signUpToken: token
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/");
    });
};

exports.postVerify = (req, res, next) => {
  const { email, signUpToken, password } = req.body;

  User.findOne({ email: email }, { signUpToken: signUpToken })
    .then(user => {
      if (user.email === email) {
        res.render("verify", {
          path: "/Verfiy",
          title: "Verify Your Account",
          isAuthenticated: false,
          errmsg: "Please Make Sure To Add Correct Email And Password",
          SuccessMessage: null,
          signUpToken: signUpToken
        });
      }
      if (!user.signUpToken) {
        res.redirect("/");
      }
      user.signUpToken = null;
      return user.save();
    })
    .then(result => {
      res.render("login", {
        path: "/login",
        title: "Login",
        errmsg: null,
        SuccessMessage: "Successfully Verifed Your Email, please Login now"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    path: "/login",
    title: "Login",
    errmsg: message,
    SuccessMessage: null
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash(
          "error",
          "Make sure you entered a valid email and password!!"
        );
        return res.redirect("/login");
      } else if (user.signUpToken) {
        req.flash("error", "Please Verfiy Your Account First");
        return res.redirect("/login");
      } else {
        return bcrypt
          .compare(password, user.password)
          .then(doMatched => {
            if (doMatched) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              req.session.save();
              res.redirect("/");
            }
            console.log("passowrd incorrect");
            req.flash(
              "error",
              "Make sure you entered a valid email and password!!"
            );
            res.redirect("/login");
          })
          .catch(err => {
            return res.redirect("/login");
          });
      }
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.likesGet = (req, res, next) => {
  const likes = req.user.likes.items;
  res.render("likes", {
    likes: likes,
    path: "/likes",
    title: `Your likes`
  });
};

exports.likesPost = (req, res, next) => {
  const movieId = req.body.movieId;
  const userId = req.user._id;
  Movie.findById(movieId)
  .then(movie => {
    const likes = req.user.likes;
   const updatedLikes =addToLikeMethod(movieId, movie, likes);
      User.findById(userId)
        .then(user => {
          user.likes = updatedLikes;
          user.save();
          res.redirect("/likes");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
  // Movie.findById({movieId})
  //   .then(movie => {

  //     const filtedredLikes = req.user.likes.items.filter(item => {
  //       return item.moveiId.toString !== movie._id.toString;
  //     });

  //     if (filtedredLikes) {
  //       const updatedLikeItems = [...filtedredLikes];
  //       updatedLikeItems.push({
  //         moveiId: new mongodb.ObjectID(),
  //         name: movie.name,
  //       });
  //       const updatedLikes = {
  //         items: updatedLikeItems
  //       };

  //       User.findOne({_id: req.user._id })
  //       .then(user => {
  //         user.likes = updatedLikes;
  //         res.redirect("/likes");
  //         return user.save();
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //     }

  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
