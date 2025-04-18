var express = require('express');
var router = express.Router();
const passport = require('passport');
const UserModel = require('../models/usermodel');
const PostModel = require('../models/postmodel');
const localStrategy = require('passport-local');
const upload = require('../config/multerconfig');
passport.use(new localStrategy(UserModel.authenticate()));
const isLoggedIn=require('../middleware/isLoggedIn')

/* GET home page. */
router.get('/', function(req, res, next) {
  let success = req.flash("success");
  let error = req.flash("error");

  res.render('index',{success,error});
});

router.post('/register',async (req,res)=>{
  try {
    const {username,fullname,email,password}=req.body;
    const user=new UserModel({
      username,
      email,
      fullname
    })
    
    await UserModel.register(user,password)
    .then((registeredUser)=>{
      passport.authenticate("local")(req,res,()=>{
        res.redirect('/profile');
      })
    })

  } catch (error) {
    console.log(error.message);
    req.flash("error", "User already exists. Please try again.");
    res.redirect('/')
  }
})
router.get('/login',(req,res)=>{
  let success = req.flash("success");
  let error = req.flash("error");
  res.render('login',{success,error});
})

router.post('/login',passport.authenticate("local",{
  successRedirect:'/feed',
  failureRedirect:'/login',
  failureFlash:true,
  successFlash:"Welcome to the site"
}),(req,res)=>{})

router.get('/logout',isLoggedIn,(req,res)=>{
  req.logout((err)=>{
    if(err){
      console.log(err);
    }
    req.flash("success","Logged out successfully")
    res.redirect('/')
  })
})

router.get('/profile',isLoggedIn,async (req,res)=>{
  const user = await UserModel.findById(req.user._id).populate('posts');
  res.render('profile',{user})
})
router.get('/feed',isLoggedIn,async (req,res)=>{
  const posts=await PostModel.find().populate('postedBy'); 
  res.render('feed',{posts,user:req.user})
})  
router.get('/edit',isLoggedIn,(req,res)=>{
  let success = req.flash("success");
  let error = req.flash("error");
  res.render('edit',{user:req.user,success,error});
})

router.post('/edit/:id', upload.single("image"), isLoggedIn, async (req, res) => {
  try {
    const { fullname, description } = req.body;
    const userId = req.params.id;

    const user = await UserModel.findById(userId)
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.fullname = fullname;
    user.description = description;

    if (req.file) {
      user.profilepic.data = req.file.buffer;
      user.profilepic.contentType = req.file.mimetype;
    }

    await user.save();
    req.flash("success", "Profile updated successfully");
    res.redirect('/profile');
  } catch (err) {
    req.flash("error", "Something went wrong while updating profile");
    console.error("Error updating profile:", err);
    res.status(500).send("Something went wrong while updating profile");
  }
});


module.exports = router;
