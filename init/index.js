const express= require ("express");
const mongoose=require('mongoose');
const sampleData = require('../init/data.js');
const listing = require('../model/listing.js');
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

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


const initData= async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(sampleData.data);
    console.log("Done! data is saved");
}

initData();