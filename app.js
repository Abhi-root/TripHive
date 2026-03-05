const express= require ("express");
const mongoose=require('mongoose');
const path =require('path');
const app =express();
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"

const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');  // header aur footer ko sab same karne ke liye
const customError=require('./utility/customError');

const listings = require('./Routes/listings.js');
const reviews = require('./Routes/reviews.js');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true} ));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.engine('ejs', ejsMate);


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





// app.get("/testListing",async (req,res)=>{

//     const list1 = new listing({
//         title:"Maza Hotel",
//         description:"Enjoy your vication",
//         price:5000,
//         location:"Bhopal",
//         country:"India",
//     })
//     await list1.save();
//     console.log("save");
//     res.send("done listing is completed ");
// })
app.get("/",(req,res)=>{
    res.send("This is a home page");
})
app.use("/alllisting",listings);
app.use("/alllisting/:id",reviews);

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