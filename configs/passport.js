const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }
      if (!bcrypt.compare(password, user.password)) {
        return done(null, false, {
          message: "Incorrect Password",
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

//whenever we login it creates user id inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;
