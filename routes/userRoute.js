const path = require("path");

const express = require("express");

const isAuth = require('../middlewares/isAuth');

const { check, body } = require("express-validator/check");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/signup", userController.getSignUp);

router.post(
  "/signup",
  [
    body("name", "Name Must Have 8 Charcters Atleast").isLength({ min: 8 }),
    body("email")
      .isEmail()
      .normalizeEmail(),
    body(
      "password",
      "Please Enter Password Number and Text (e.g 123abd) And Atleast 8 Charcters"
    )
      .isAlphanumeric()
      .isLength({ min: 8 })
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password has to match!");
      }
      return true;
    })
  ],
  userController.postSignUp
);

router.get("/verfiy/:token", userController.getVerify)

router.post('/verify', userController.postVerify)

router.get("/thanks", userController.thanks);

router.get("/login", userController.getLogin);

router.post("/login", userController.postLogin);

router.post("/logout", userController.postLogout);

router.post("/addlikes",isAuth,  userController.likesPost);

router.get("/likes", isAuth, userController.likesGet);

module.exports = router;
