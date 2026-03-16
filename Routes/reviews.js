const express = require('express');
const router = express.Router({mergeParams:true});
const reviewSchema = require('../model/rv.js');
const listing=require("../model/listing.js");
const Review=require("../model/review.js");
const asyncWrap=require('../utility/asyncWrap');

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

// TO SAVE ALL REVIEWS
router.post("/review", reviewValidate, asyncWrap(async (req, res) => {
    let { id } = req.params;
    let { review } = req.body;
    let data = await listing.findById(id);
    let reviewData = new Review(review)
    data.reviews.push(reviewData);
    await reviewData.save();
    await data.save();
     req.flash("sucess","Review is saved sucessfully");
    res.redirect(`/alllisting/${id}`);

}))

// DELETE PARTICULAR REVIEW

router.delete("/:review_id", asyncWrap(async (req, res) => {
    let { id, review_id } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
       req.flash("sucess","Review is deleted sucessfully");
    res.redirect(`/alllisting/${id}`);

}))

module.exports = router;