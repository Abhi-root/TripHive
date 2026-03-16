const express = require('express');
const router = express.Router();
const asyncWrap=require('../utility/asyncWrap');
const listing=require("../model/listing.js");
const schema = require('../model/listingSchemaValidate.js');
const customError=require('../utility/customError');

// Validation

const validate = (req, res, next) => {
    const listingData = req.body;
    listingData.image = {
        url: listingData.url || ""
    };
    delete listingData.url;
    const { error } = schema.validate(listingData);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new customError(400, errMsg);
    } else {
        next();
    }
}

// SHOWING ALL LISTING

router.get("/", asyncWrap(async (req, res) => {
    const data = await listing.find({});
    
    res.render("listings/index", { data });
}))

// SHOWING NEW LISTING 
router.get("/newlisting", (req, res) => {
    res.render("listings/newListing");
})

// CREATING NEW LISTING

router.post("/newlisting", validate, asyncWrap(async (req, res) => {
    const listingData = req.body;
    listingData.image = {
        url: listingData.url || ""
    };
    delete listingData.url;
    console.log(listingData);
    const data = new listing(listingData);
    await data.save(); 
    req.flash("sucess","listing is created sucessfully");
    res.redirect("/alllisting");
}));


// SHOWING PARTICULAR LISTING

router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const data = await listing.findOne({ _id: id }).populate("reviews");
    res.render("listings/show", { data });

}));

// SHOW EDIT PAGE

router.get("/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findById(id);
    res.render("listings/edit", { data });
}));

// UPDATING LISTING DATA:-
router.put("/:id", validate, asyncWrap(async (req, res) => {
    let { id } = req.params;
    const listingData = req.body;
    listingData.image = {
        url: listingData.url || ""
    };
    delete listingData.url;
    let data = await listing.findByIdAndUpdate(id, listingData);
    req.flash("sucess","Listing is updated sucessfully");
    res.redirect(`/alllisting/${id}`);
}));

// DELETE LISTING

router.delete("/:id/delete", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let data = await listing.findByIdAndDelete(id);
    req.flash("sucess","Listing is deleted sucessfully");
    res.redirect("/alllisting");
}));


module.exports = router;