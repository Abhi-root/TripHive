const express = require('express');
const router = express.Router();
const userSchema = require('../model/user');
const passport = require('passport');


router.get("/signup",(req,res)=>{
    res.render("users/signup");
    
});

router.get("/login",(req,res)=>{
    res.render("users/login");
    
});

router.post("/login",
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    (req,res)=>{
        req.flash("success","Welcome On Wanderlust");
        res.redirect("/alllisting");
})

router.post("/signup",async (req,res)=>{
    try{
          let {username,email,password}=req.body;
    const newUser = new userSchema({
        username:username,
        email:email
    });

    const registerdUser = await userSchema.register(newUser,password);
    req.flash("success","User Registered Successfully");
    res.redirect("/alllisting");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
  
    
});

module.exports = router;