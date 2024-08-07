
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
    spaceSocialLink:{
        type:String,
        required:true
    },
    spaceTheme:{
        type:String,
        required:true
    },
    spaceStarRating:{
        type:String,
        required:true
    },
    spaceLink:{
        type:String,
        
        unique:true
    }
    
},{
    timestamps:true
})
export const space = mongoose.model("space",Space)