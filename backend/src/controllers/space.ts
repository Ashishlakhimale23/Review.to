import { Request,Response } from "express" 
import {Space} from "../types/space"
import { space } from "../model/space"
import { User } from "../model/user"
import { RemoveAnySpaces } from "../utils/RemoveAnySpaces"
import cloudinary from "../utils/Cloudinary"
import {Readable} from "stream"
export const CreateSpace =async (req:Request<{},{},{space:Space,uid:string}>,res:Response)=>{
    const {spaceName,spaceCustomMessage,spaceImage,spaceQuestion,spaceSocialLinks,spaceStarRating,spaceTheme,spaceTitle}  = req.body.space
    const firebaseuid = req.body.uid
    console.log(firebaseuid) 
    try{
    let spaceLink:string ; 
    let SpaceName = spaceName.replace(/\s+/g,' ').trim();
    let name = RemoveAnySpaces(spaceName)
    let spaceImage:string;
     
    if(req.file){
        spaceImage =await new Promise<string>((resolve,reject)=>{
        let uploadStream = cloudinary.v2.uploader.upload_stream({
            upload_preset:process.env.UPLOAD_PRESET
        },(err,res)=>{
            if(err){
                return reject(err)
            } 
            resolve(res?.secure_url!)
        })
         Readable.from(req.file?.buffer!).pipe(uploadStream)
    })
    }
    
    

    await space.countDocuments({spaceName:SpaceName}).then((resp)=>{
        spaceLink = `http://review.to/${resp ? name+resp :name}` 
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
        
         await User.findOneAndUpdate({firebaseUid:firebaseuid},{$push:{space:resp._id}}).then((resp)=>{
            console.log(resp)
            return res.status(201).json({spaceName:spaceName,spaceLinks:spaceLink})
        }).catch((error)=>{
            return res.status(500).json({message:"failed to upadate the users space array"})
        })
    }).catch((error)=>{
        console.log(error)
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
            return res.status(200).json({data:result}).end()
        }).catch((error)=>{
            return res.status(500).json({message:"couldnt find the user"})
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server issue"})
    }
}


export const DeleteSpace = async(req:Request<{},{},{uid:string,Deleteid:string}>,res:Response )=>{
    const Deleteid = req.body.Deleteid
    const userFirebasuid = req.body.uid
    try{
        await space.findOneAndDelete({_id:Deleteid}).then(async ()=>{
            await User.findOneAndUpdate({firebaseUid:userFirebasuid},{$pull:{'space':Deleteid}}).then(()=>{
                return res.status(200).json({message:"Delete the space"})
            }).catch((error)=>{
                return res.status(500).json({message:'internal server error'})
            })
        }).catch((error)=>{
            return res.status(500).json({message:"internal server error"})
        })
        
    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }

}

