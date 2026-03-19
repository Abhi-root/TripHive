const express= require ("express");
const app =express();
const mongoose=require('mongoose');
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
const path =require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');  // header aur footer ko sab same karne ke liye

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);


const customError=require('./utility/customError');
const listingsRouter = require('./Routes/listings.js');
const reviewsRouter = require('./Routes/reviews.js');
const usersRouter = require('./Routes/users.js');
const userSchema = require('./model/user.js');


async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
    .then(()=>{
        console.log("mongoose is connected");
    })
    .catch((err)=>{
        console.log(err);
    });


    
const sessionOption= {
    secret:"superSecretKey",
    resave: false,
    saveUninitialized:true,
    cookie:{
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}


app.use(express.urlencoded({extended:true} ));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userSchema.authenticate()));

passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser= req.user;
    next();
})

app.get("/",(req,res)=>{
    res.send("This is a home page");
})


app.use("/alllisting",listingsRouter);
app.use("/",usersRouter);
app.use("/alllisting/:id",reviewsRouter);


app.use((req,res,next)=>{
    next(new customError(404,"page not found"));
})

app.use((err,req,res,next)=>{
    let {status=401,message="something went wrong"}=err;
    res.status(status).render("listings/error",{err});
});

app.listen(3000,()=>{
    console.log("server is on");
});