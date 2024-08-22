import { boolean } from "joi";
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
    UploadPhoto:{
        type:String,
        required:true
    },
    AttachImage:{
        type:String
    },
    StarRating:{
        type:[Boolean]
    },
    SocialLink:{
        type:String
    },
    WallOfFame:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
export const Review = mongoose.model("Review",ReviewModel) 