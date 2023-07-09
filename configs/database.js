require("dotenv").config();
const mongoose = require("mongoose");
dbURL = process.env.MONGO_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log("DB is Connected Successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });
