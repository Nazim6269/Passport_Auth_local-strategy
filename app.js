const express = require("express");
const router = require("./routes/user.route");
const cors = require("cors");
const app = express();
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("./configs/database");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./configs/passport");
const passport = require("passport");

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    //cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", router); //must be bottom

module.exports = app;
