
import mongoose from "mongoose";

const Space = new mongoose.Schema({
    spaceName :{
        type : String,
        required : true
    },
    spaceTitle:{
        type:String,
        required:true
    }, 
    spaceImage:{
        type:String,
        required:true
    },
    spaceCustomMessage:{
        type:String,
        required:true
    },
    spaceQuestion:{
        type:[String],
        required:true
    },
    spaceSocialLinks:{
        type:Boolean,
        required:true
    },
    spaceStarRating:{
        type:Boolean,
        required:true
    },
    spaceLink:{
        type:String,
        unique:true
    },
   Reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }],
    
},{
    timestamps:true
})
export const space = mongoose.model("space",Space)