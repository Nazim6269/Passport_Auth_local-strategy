const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("../configs/passport");

//all get operations are below
router.get("/", (req, res) => {
  res.status(201).render("index");
});

router.get("/register", (req, res) => {
  res.status(201).render("register");
});

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile");
});

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.render("../views/login.ejs");
  }
  next();
};

router.get("/login", checkLoggedIn, (req, res) => {
  res.status(201).render("login.ejs");
});

router.get("/logout", (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//all post operations are below
router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (user === req.body.username) {
      return res.status(400).send("User already exist");
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      const newUser = new User({
        username,
        email,
        password: hash,
      });
      await newUser.save();
      return res.status(201).redirect("/login");
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

module.exports = router;
