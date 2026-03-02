const express= require ("express");
const mongoose=require('mongoose');
const path =require('path');
const app =express();
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"
const listing=require("./model/listing.js");
const Review=require("./model/review.js");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const customError=require('./utility/customError');
const asyncWrap=require('./utility/asyncWrap')
const schema = require('./model/listingSchemaValidate.js');
const reviewSchema = require('./model/rv.js');


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

const validate= (req,res,next)=>{
  const listingData = req.body;
     listingData.image = {
     url: listingData.url || ""
     };
     delete listingData.url;
 console.log("BODY =", req.body);
console.log("LISTING =", req.body.listing);
 const {error} = schema.validate(listingData);
  if(error){
    const errMsg= error.details.map((el)=>el.message).join(",");
    throw new customError(400,errMsg);
  }else{
    next();
  }
}

const reviewValidate= (req,res,next)=>{
 const reviewData = req.body;
 const {error} = reviewSchema.validate(reviewData);
  if(error){
    const errMsg= error.details.map((el)=>el.message).join(",");
    console.log(error)
    throw new customError(400,errMsg);
  }else{
    next();
  }
}


app.get("/",(req,res)=>{
    res.send("This is home page");
})

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


// SHOWING ALL LISTING

app.get("/alllisting",asyncWrap(async (req,res)=>{
     const data = await listing.find({});
    res.render("listings/index",{data});
}))

// SHOWING NEW LISTING 

app.get("/alllisting/newlisting",(req,res)=>{
    res.render("listings/newListing");
})

// CREATING NEW LISTING

app.post("/alllisting/newlisting",validate ,asyncWrap(async (req, res) => {
      const listingData = req.body;
     listingData.image = {
     url: listingData.url || ""
     };
     delete listingData.url;
    console.log(listingData);
  const data = new listing(listingData);
  await data.save();
  res.redirect("/alllisting");
}));


// SHOWING PARTICULAR LISTING

app.get("/alllisting/:id", asyncWrap(async(req,res)=>{
    let {id}=req.params;
    const data= await listing.findOne({_id:id}).populate("reviews");
    res.render("listings/show",{data});
}));

// SHOW EDIT PAGE

app.get("/alllisting/:id/edit",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data = await listing.findById(id);
    res.render("listings/edit",{data});
}));

// UPDATING LISTING DATA:-
app.put("/alllisting/:id",validate,asyncWrap(async (req,res)=>{
     let {id}=req.params;
     const listingData = req.body;
     listingData.image = {
     url: listingData.url || ""
     };
     delete listingData.url;
    let data = await listing.findByIdAndUpdate(id,listingData);
    res.redirect(`/alllisting/${id}`);
}));

// DELETE LISTING

app.delete("/alllisting/:id/delete",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let data = await listing.findByIdAndDelete(id);
    res.redirect("/alllisting");
}));

// TO SAVE ALL REVIEWS
app.post("/alllisting/:id/review",reviewValidate,asyncWrap(async(req,res)=>{
    let {id}=req.params;
    let {review}=req.body;
    let data = await listing.findById(id);
    let reviewData= new Review(review)
    data.reviews.push(reviewData);
    await reviewData.save();
    await data.save();
    res.redirect(`/alllisting/${id}`);

}))

// DELETE PARTICULAR REVIEW

app.delete("/alllisting/:id/:review_id",asyncWrap( async (req,res)=>{

    let {id,review_id}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    res.redirect(`/alllisting/${id}`);

}))


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