require('dotenv').config();
const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const dbName = "pinclone";
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4uhzkxk.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  },
  profilepic: {
    data: Buffer,
    contentType: String
  },
  description: String,
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
