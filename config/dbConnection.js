require('dotenv').config();
const mongoose = require("mongoose");

const dbName = "pinclone";
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4uhzkxk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });