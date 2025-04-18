const mongoose = require("mongoose");
const plm=require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema =mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true
    },
    profilepic:{
        data:Buffer,
        contentType:String
    },
    description:String,
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);