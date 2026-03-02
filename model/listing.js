const mongoose=require('mongoose');
const review = require('./review.js')
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type:String,
        required:true
    },
    description : String,
        image:{
              url:{
            type:String,
            default:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
             set:(v)=> v===""?"https://images.unsplash.com/photo-1504470695779-75300268aa0e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
        },

        },
      

        price: {
            type: Number,
            required:true
        },
    location : String,
    country: String,
    reviews:[
        {type: Schema.Types.ObjectId, ref:'Review'}
    ]
});


listingSchema.post("findOneAndDelete", async (listing) => {
   await review.deleteMany({ _id: { $in: listing.reviews } });
   // await console.log(data.order);
})
const Listing= mongoose.model("Listing",listingSchema);
module.exports = Listing;
