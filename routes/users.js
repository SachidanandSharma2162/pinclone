var express = require('express');
var router = express.Router();
const passport = require('passport');
const UserModel = require('../models/usermodel');
const PostModel = require('../models/postmodel');
const localStrategy = require('passport-local');
const upload = require('../config/multerconfig');
const isLoggedIn=require('../middleware/isLoggedIn')

passport.use(new localStrategy(UserModel.authenticate()));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/users", isLoggedIn, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const allUsers = await UserModel.find();
    const currentUser = await UserModel.findById(loggedInUserId);

    // Filter out the logged-in user
    const users = allUsers.filter(user => user._id.toString() !== loggedInUserId.toString());

    res.render("users", { users, currentUser });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/follow/:id", isLoggedIn, async (req, res) => {
  try {
    const userToToggle = await UserModel.findById(req.params.id);
    const currentUser = await UserModel.findById(req.user._id);

    if (!userToToggle || !currentUser) {
      return res.status(404).send("User not found");
    }

    const isFollowing = currentUser.following.includes(userToToggle._id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== userToToggle._id.toString()
      );
      userToToggle.followers = userToToggle.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      currentUser.following.push(userToToggle._id);
      userToToggle.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToToggle.save();

    res.redirect("/users/users");
  } catch (err) {
    console.error("Error toggling follow/unfollow:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.get('/postimage',isLoggedIn,(req,res)=>{
  res.render('createpost')
})

router.post('/submitimage',isLoggedIn,upload.single("image"),async (req,res)=>{
  try {
    const { title, description } = req.body;

    const newPost = await PostModel.create({
      title,
      description,
      postedBy: req.user._id,
      picture: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    const currentUser = await UserModel.findById(req.user._id);
    currentUser.posts.push(newPost._id);
    await currentUser.save();

    res.redirect("/feed");
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).send("Internal Server Error");
  }
})
router.get('/like/:postid',isLoggedIn,async (req,res)=>{
  try {
    const postId = req.params.postid;
    const post = await PostModel.findById(postId).populate("postedBy");
    const currentUser = await UserModel.findById(req.user._id);

    if (!post || !currentUser) {
      return res.status(404).send("Post or user not found");
    }

    const isLiked = post.likedby.includes(currentUser._id);

    if (isLiked) {
      post.likedby = post.likedby.filter(id => id.toString() !== currentUser._id.toString());
    } else {
      post.likedby.push(currentUser._id);
    }

    await post.save();
    res.redirect("/profile");
  } catch (err) {
    console.error("Error liking/unliking post:", err);
    res.status(500).send("Internal Server Error");
  }
})
router.get('/getinamge/:id',isLoggedIn,async (req,res)=>{
  try {
    const post = await PostModel.findById(req.params.id)
        .populate('postedBy')
        .populate('likedby')
        .populate('comments.user');
    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render('imageinfo', { post, user: req.user });
} catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
}
})
router.post('/comment/:id',isLoggedIn,async (req,res)=>{
  try {
    const postId = req.params.id;
    const { text } = req.body;

    const post = await PostModel.findById(postId);
    const currentUser = await UserModel.findById(req.user._id);

    if (!post || !currentUser) {
      return res.status(404).send("Post or user not found");
    }

    post.comments.push({ user: currentUser._id, text: text });
    await post.save();

    res.redirect(`/users/getinamge/${postId}`);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).send("Internal Server Error");
  }
})
router.get('/userprofile/:userid', isLoggedIn, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid)
      .populate('followers')
      .populate('following')
      .populate({
        path: 'posts',
        populate: {
          path: 'postedBy'
        }
      });

    if (!user) return res.status(404).send("User not found");

    res.render('userprofile', { profileUser: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
