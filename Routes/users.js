const express = require('express');
const router = express.Router();
const userSchema = require('../model/user');
const passport = require('passport');

// Sign Up
router.get("/signup",(req,res)=>{
    res.render("users/signup");  
});

router.post("/signup",async (req,res)=>{
    try{
          let {username,email,password}=req.body;
    const newUser = new userSchema({
        username:username,
        email:email
    });

    const registerdUser = await userSchema.register(newUser,password);
    req.login(registerdUser,(err)=>{
        if(err) return next(err);
        req.flash("success","User Registered Successfully");
        res.redirect("/alllisting");
    })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
});

// Login

router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    (req,res)=>{
        req.flash("success","Welcome On Wanderlust");
        res.redirect("/alllisting");
})

// Logout

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successfully");
        res.redirect("/alllisting");
    })
})


module.exports = router;