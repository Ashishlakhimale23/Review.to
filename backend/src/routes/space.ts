import express from "express"
import { AuthMidddleware } from "../middlerware/Auth"
import { CreateSpace, DeleteSpace, GetAllReviews, GetAllSpaces, getSpaceDetails, submitReivew,AddtoWallofFame } from "../controllers/space"
import { upload } from "../utils/Cloudinary"
export const spaceRouter = express.Router()
const uploadFields = upload.fields([
  { name: 'AttachImage', maxCount: 1 },
  { name: 'UploadPhoto', maxCount: 1 },
  { name: 'files', maxCount: 2 } 
]);
spaceRouter.post("/createspace",upload.single("spaceImage"),AuthMidddleware,CreateSpace)
spaceRouter.get("/getspace",AuthMidddleware,GetAllSpaces)
spaceRouter.post("/deletespace",AuthMidddleware,DeleteSpace)
spaceRouter.post("/getspacedetails",getSpaceDetails)
spaceRouter.post("/submitreview",uploadFields,submitReivew)
spaceRouter.post('/getallreviews',AuthMidddleware,GetAllReviews)
spaceRouter.post('/editwalloflove',AuthMidddleware,AddtoWallofFame)