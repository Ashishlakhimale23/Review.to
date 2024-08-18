import mongoose from "mongoose";

const ReviewModel  = new mongoose.Schema({
    Message:{
        type:String,
        required:true
    },
    YourName:{
        type:String,
        required:true
    },
    YourEmail:{
        type:String,
        required:true
    },
    UploadedPhoto:{
        type:String,
        required:true
    },
    AttachedPhoto:{
        type:String
    },
    StarRating:{
        type:[Boolean]
    },
    SocailLinks:{
        type:String
    }
},{
    timestamps:true
})
export const Review = mongoose.model("Review",ReviewModel) 