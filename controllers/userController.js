const Movie = require("../models/Movies");
const User = require("../models/User/User");
const LikeMethods = require("../models/User/likeMethods");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const fetch = require("node-fetch");

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

  User.findOne({ email: email })
    .then(userDoc => {
      if (!userDoc) {
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
            <p>Click <a href="https://homeciinema.herokuapp.com/verfiy/${token}">HERE</a></p>
            `
              });
              return res.redirect("/thanks");
            });
        });
      }
      return res.status(422).render("signup", {
        title: "Sign Up",
        path: "/emailExsist",
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
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        path: "/verify",
        title: "Verify Your Account",
        isAuthenticated: false,
        errmsg: null,
        SuccessMessage: null,
        token: token
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postVerify = (req, res, next) => {
  const { email, token, password } = req.body;

  console.log(token);

  User.findOne({ email: email }, { signUpToken: token })
    .then(user => {
      console.log(user);
      if (!user) {
        res.render("verify", {
          path: "/Verfiy",
          title: "Verify Your Account",
          isAuthenticated: false,
          errmsg: "Please Make Sure To Add Correct Email And Password",
          SuccessMessage: null,
          token: token
        });
      }
      if (!user.signUpToken) {
        return res.redirect("/");
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.thanks = (req, res, next) => {
  res.render("thanks", {
    path: "/thanks",
    title: "thanks",
    errmsg: null,
    SuccessMessage: "Successfully Signed Up , Please Verify Your Email now"
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLoginWithFB = async (req, res, next) => {
  const { accessToken, userID } = req.body;
  const response = await fetch(
    `https://graph.facebook.com/v3.3/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`
  );
  console.log();
  
  const rejson = await response.json();
  console.log(rejson.name);
    console.log(req.body);
    
  try {
    if (rejson.id === userID) {
      const response = await User.findOne({ facebookId: userID });

      if (response) {
        
        req.session.isLoggedIn = true;
        req.session.user = response;
        req.session.save();
        res.json({ status: 200, message: "User Loged In" });
      } else {
        const user = new User({
          name: rejson.name,
          email:null,
          password:null,
          facebookId: userID,
          accessToken,
          likes: { item: [] }
        });
         user.save();
        res.json({ status: 201, message: "User Signedup" });
      }
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);

  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getResetPass = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("reset", {
    errmsg: message,
    hasError: false,
    path: "/reset",
    title: `Reset Your Password`
  });
};

exports.postResetPass = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "This Email Dosent Found!!!");
          return res.redirect("/reset");
        }
        user.resetPassToken = token;
        user.resetPassTokenExpr = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        transport.sendMail({
          to: req.body.email,
          from: "HomeCinema-Team@mail.com",
          subject: "Password Reset...",
          html: `
        <p>You Requsetd a password reset</p>
        <p>Click <a href="https://homeciinema.herokuapp.com/reset/${token}">HERE</a> To Change It</p>
        `
        });
        res.render("thanks", {
          path: "/reset",
          title: "Request Submitted",
          errmsg: null,
          isAuthenticated: false
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getChangePass = async (req, res, next) => {
  const token = req.params.token;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const userDoc = await User.findOne({ resetPassToken: token });
  if (!userDoc) {
    return res.redirect("/");
  }

  return res.render("verify", {
    userId: userDoc._id,
    errmsg: message,
    SuccessMessage: null,
    hasError: false,
    token: token,
    path: `/reset/${token}`,
    title: `Reset Your Password`
  });
};
exports.postChangePass = async (req, res, next) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const password = req.body.password;
  const errors = validationResult(req);
  const userDoc = await User.findOne({ _id: userId });

  try {
    if (!userDoc) {
      return res.redirect(`/`);
    }

    if (!errors.isEmpty()) {
      return res.render("verify", {
        userId: userDoc._id.toString(),
        errmsg: errors.array()[0].msg,
        SuccessMessage: null,
        hasError: true,
        token: token,
        path: `/reset/${token}`,
        title: `Reset Your Password`,
        oldInputs: {
          password: password,
          confirmPassword: req.body.confirmPassword
        }
      });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    userDoc.password = hashedpassword;
    userDoc.resetPassToken = null;
    userDoc.save();

    return res.render("login", {
      errmsg: null,
      SuccessMessage: "Password Successfuly Changed.",
      hasError: false,
      path: `/login`,
      title: `Password Successfuly Changed`
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.likesGet = (req, res, next) => {  
  const likes = req.user.likes.items;
  
    return res.render("likes", {
      likes: likes,
      path: "/likes",
      title: `Movies You liked`
    });

};

exports.likesPost = (req, res, next) => {
  const movieId = req.body.movieId;
  const likes = req.user.likes;
  Movie.findById(movieId)
    .then(movie => {
      const updatedLikes = LikeMethods.like(movie, likes);
      User.findById(req.user._id)
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.unlikePost = (req, res, next) => {
  const movieId = req.params.movieId;
  const likes = req.user.likes;
  const updatedLikes = LikeMethods.unlike(movieId, likes);
  User.findById(req.user._id)
    .then(user => {
      user.likes = updatedLikes;
      user.save();
      return res.json({ message: 'Success' })
    })
    .catch(err => {
      console.log("aaaa" + err);
      
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
