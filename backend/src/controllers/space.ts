import { Request,Response } from "express" 
import {Space} from "../types/space"
import { space } from "../model/space"
import { User } from "../model/user"
import { RemoveAnySpaces } from "../utils/RemoveAnySpaces"
import { CloudinaryUpload } from "../utils/CloudinaryUpload"
import { Review } from "../model/review"
import cloudinary from "../utils/Cloudinary"

export const CreateSpace =async (req:Request<{},{},{space:FormData & Space,uid:string}>,res:Response)=>{


    const {space:FormData,uid} = req.body
    console.log(FormData)
    const firebaseuid = uid
    const {spaceName,spaceCustomMessage,spaceQuestion,spaceImage:spaceimage,spaceSocialLinks,spaceStarRating,spaceTheme,spaceTitle,_id,status}  =FormData 
    const isStatus =typeof status ==='string'? status === 'true' :status;
    let spaceImage:string;
    let spaceLink:string ; 
    let SpaceName = spaceName.replace(/\s+/g,' ').trim();
    let name = RemoveAnySpaces(spaceName)
     
        try {
            const resp = await space.countDocuments({ spaceName: SpaceName })
            spaceLink = `${resp ? name+resp :name}`
            if(req.file &&  !isStatus){
                spaceImage = await CloudinaryUpload(req.file)
            let NewSpace = {
                spaceName: SpaceName,
                spaceTitle: spaceTitle,
                spaceImage: spaceImage,
                spaceCustomMessage: spaceCustomMessage ,
                spaceQuestion: spaceQuestion,
                spaceSocialLinks:spaceSocialLinks ,
                spaceStarRating: spaceStarRating,
                spaceTheme: spaceTheme,
                spaceLink: spaceLink
            }
            
                const response = await space.findByIdAndUpdate( _id,NewSpace , {
                    upsert: true, setDefaultsOnInsert: true ,new:true
                })
                console.log(response)
                return res.status(200).json({ spaceLinks: spaceLink, spaceName: spaceName })
            }
            if(!req.file && !isStatus){
               
            let NewSpace = {
                spaceName: SpaceName,
                spaceTitle: spaceTitle,
                spaceImage: spaceimage,
                spaceCustomMessage: spaceCustomMessage ,
                spaceQuestion: spaceQuestion,
                spaceSocialLinks:spaceSocialLinks ,
                spaceStarRating: spaceStarRating,
                spaceTheme: spaceTheme,
                spaceLink: spaceLink
            }
            
                const response = await space.findByIdAndUpdate({_id:_id},NewSpace,{
                    upsert: true, setDefaultsOnInsert: true,new:true
                })
               
                return res.status(200).json({ spaceName: spaceName , spaceLinks: spaceLink})
            } if(req.file && isStatus) {
                spaceImage = await CloudinaryUpload(req.file)
                const NewSpace = new space({
                    spaceName: SpaceName,
                    spaceTitle: spaceTitle,
                    spaceImage: spaceImage,
                    spaceCustomMessage: spaceCustomMessage,
                    spaceQuestion: spaceQuestion,
                    spaceSocialLinks: spaceSocialLinks,
                    spaceStarRating: spaceStarRating,
                    spaceTheme: spaceTheme,
                    spaceLink: spaceLink
                })
                const result = await NewSpace.save()
                console.log(result) 
                await User.findOneAndUpdate({ firebaseUid: firebaseuid }, { $push: { space: result._id } })
                return res.status(201).json({ spaceName: spaceName, spaceLinks: spaceLink })
            }
            
        
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: 'internal server issue' })
        }
 
}

export const GetAllSpaces = async (req:Request<{},{},{uid:string}>,res:Response)=>{
    const firebaseuid = req.body.uid;
    try{
        await User.findOne({firebaseUid:firebaseuid}).populate("space",'spaceName spaceImage spaceLink').then((result)=>{
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
        await space.findOneAndDelete({_id:Deleteid}).then(async (resp)=>{
            let Array = resp?.Reviews
            await Review.deleteMany({_id:{$in:Array}})
            await User.findOneAndUpdate({firebaseUid:userFirebasuid},{$pull:{'space':Deleteid}})
            return res.status(200).json({message:"space deleted"})
        }
        ).catch((error)=>{
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
            const spaceinfo  = await space.findOne({spaceLink:spacelink})        
            if(spaceinfo){
                return res.status(200).json({details:spaceinfo})
            }
            return res.status(500).json({message:"space not found"})
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
            SocialLink:SocialLink,
            AttachImage:AttachLink,
            UploadPhoto:UploadPhotoLink
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

export const GetAllReviews=async(req:Request<{},{},{spaceLink:string,uid:string}>,res:Response)=>{
    console.log(req.body)
    let spaceLink = req.body.spaceLink
    try{
        const result = await space.findOne({spaceLink:spaceLink}).populate("Reviews") 
        console.log(result)
        return res.status(200).json({result:result})

    }catch(error){
        return res.status(500).json({message:"internal server error"})
}
}

export const AddtoWallofFame=async(req:Request<{},{},{uid:string,Reviewid:string}>,res:Response)=>{
    const firebaseUid = req.body.uid
    const Reviewid = req.body.Reviewid
    console.log(req.body)
    if(!firebaseUid || !Reviewid ){
        return res.status(500).json({message:"Error occured try again."})
    }
    else{
        try{
            const response = await Review.findById(Reviewid)
            console.log(response)
            if(response){
                const walloffame = response.WallOfFame
                response.WallOfFame= !response.WallOfFame
                await response.save()
                return res.status(200).json({message:"success"})
                
            }

        }catch(error){
            return res.status(500).json({message:"internal server error"})
        }
    }

}

export const DeleteReview=async(req:Request<{},{},{uid:string,Reviewid:string,SpaceLink:string}>,res:Response)=>{
    const firebaseuid : string = req.body.uid 
    const id: string = req.body.Reviewid
    const SpaceLink:string = req.body.SpaceLink
    if(!firebaseuid || !id|| !SpaceLink){
        return res.status(500).json({message:"Fields not provided"})
    }
    try{
        const response = await Review.findByIdAndDelete(id)
        console.log(response)
        await space.findByIdAndUpdate(id,{$pull:{'Reviews':id}})
        return res.json({message:"deleted"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error"})

    }


}