import { Request,Response } from "express" 
import {Space} from "../types/space"
import { space } from "../model/space"
import { User } from "../model/user"
import { RemoveAnySpaces } from "../utils/RemoveAnySpaces"
export const CreateSpace =async (req:Request<{},{},{space:Space,uid:string}>,res:Response)=>{
    const {spaceName,spaceImage,spaceCustomMessage,spaceQuestion,spaceSocialLinks,spaceStarRating,spaceTheme,spaceTitle}  = req.body.space
    const firebaseuid = req.body.uid
    
    try{
    let spaceLink:string ; 
    let SpaceName = spaceName.replace(/\s+/g,' ').trim();
    let name = RemoveAnySpaces(spaceName)
    await space.find({spaceName:SpaceName}).select("spaceName").then((resp)=>{
        spaceLink = `http://review.to/${resp.length ? name+resp.length :name}` 
    }).then(()=>{
            
    const NewSpace  = new space({
        spaceName:SpaceName,
        spaceTitle:spaceTitle,
        spaceImage:spaceImage,
        spaceCustomMessage:spaceCustomMessage,
        spaceQuestion:spaceQuestion,
        spaceSocialLink:spaceSocialLinks,
        spaceStarRating:spaceStarRating,
        spaceTheme:spaceTheme,
        spaceLink:spaceLink
    })
    NewSpace.save().then(async (resp)=>{
         await User.findOneAndUpdate({firebaseUid:firebaseuid},{$push:{'space':resp._id}}).then(()=>{
            return res.status(201).json({spaceName:spaceName,spaceLinks:spaceLink})
        }).catch((error)=>{
            return res.status(500).json({message:"failed to upadate the users space array"})
        })
    }).catch(()=>{
        return res.status(500).json({message:"failed to create a space"})
    })
    }).catch(()=>{
        return res.status(500).json({message:"failed to create a space"})
    })
     
    }catch(error){
        return res.status(500).json({message:'internal server issue'})
    }
    
}

export const GetAllSpaces = async (req:Request<{},{},{uid:string}>,res:Response)=>{
    const firebaseuid = req.body.uid;
    try{
        await User.findOne({firebaseUid:firebaseuid}).populate("space",'spaceName spaceImage').then((result)=>{
            console.log(result)
            return res.status(201).json({data:result}).end()
        }).catch((error)=>{
            return res.status(500).json({message:"couldnt find the user"})
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server issue"})
    }
}