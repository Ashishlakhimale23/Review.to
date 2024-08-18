import { Request,Response } from "express" 
import {Space, SumbitReivew} from "../types/space"
import { space } from "../model/space"
import { User } from "../model/user"
import { RemoveAnySpaces } from "../utils/RemoveAnySpaces"
import cloudinary from "../utils/Cloudinary"
import {Readable} from "stream"
import { CloudinaryUpload } from "../utils/CloudinaryUpload"
import { Review } from "../model/review"
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
        spaceImage = await CloudinaryUpload(req.file)
        console.log(spaceImage)
    }

    await space.countDocuments({spaceName:SpaceName}).then((resp)=>{
        spaceLink = `${resp ? name+resp :name}` 
    }).then(()=>{
            
    const NewSpace  = new space({
        spaceName:SpaceName,
        spaceTitle:spaceTitle,
        spaceImage:spaceImage,
        spaceCustomMessage:spaceCustomMessage,
        spaceQuestion:spaceQuestion,
        spaceSocialLinks:spaceSocialLinks,
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


export const getSpaceDetails =async(req:Request<{},{},{spacelink:string}>,res:Response)=>{
    const spacelink = req.body.spacelink
    console.log(spacelink)
    if(!spacelink){
        return res.status(500).json({message:"spacelink not provided"})
    }
    else{
        try{
            await space.findOne({spaceLink:spacelink}).then((resp)=>{
                console.log(resp)
                res.status(200).json({details:resp})
            }).catch(err=>{
                return res.status(500).json({message:"internal server error"})
        })
        }catch(error){
            return res.status(500).json({message:"internal server error"})
        }
    }
}

export const submitReivew =async (req:Request,res:Response)=>{
    const { Message,YourName,YourEmail,checkbox,StarRating,SocialLink,spacelink} = req.body 
    const files = req.files as { [fieldname: string]: Express.Multer.File[] }
    const AttachImage =files["AttachImage"]?.[0] 
    const UploadPhoto= files["UploadPhoto"]?.[0]
    let AttachLink 
    let UploadPhotoLink
    if(!UploadPhoto){
        return res.status(500).json({message:"No upload photo provided"})
    }
    if(AttachImage){
        try{
        AttachLink = await CloudinaryUpload(AttachImage)
        }catch(error){
            return res.status(500).json({message:"Error while uploading file"})
        }
    }
    try{
        UploadPhotoLink = await CloudinaryUpload(UploadPhoto)
        const newReview = new Review({
            Message:Message,
            YourEmail:YourEmail,
            YourName:YourName,
            StarRating:StarRating,
            SocailLinks:SocialLink,
            AttachedPhoto:AttachLink,
            UploadedPhoto:UploadPhotoLink
        })

        await newReview.save().then(async (resp)=>{
            await space.findOneAndUpdate({spaceLink:spacelink},{$push:{"Reviews":resp._id}}).then(()=>{
                return res.status(200).json({ message: "create review" })
            })

        })
    }catch(error){
        return res.status(500).json({message:"internal server error"})
    }



}