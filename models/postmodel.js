const mongoose = require("mongoose");
const plm=require("passport-local-mongoose");

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    likedby:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comments:[{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        text:{
            type:String
        }
   }],
    picture:{
        data:Buffer,
        contentType:String
    }
})

module.exports = mongoose.model("post", postSchema);