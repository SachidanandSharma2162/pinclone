const passport=require('passport');

module.exports=function(req,res,next){
    if(req.isAuthenticated()){
      return next();
      
    }
    else{
      req.flash("error","You need to login first")
      res.redirect('/login')
    }
  }