import express from "express"
import { AuthMidddleware } from "../middlerware/Auth"
import { CreateSpace, DeleteSpace, GetAllSpaces } from "../controllers/space"
import { upload } from "../utils/Cloudinary"
export const spaceRouter = express.Router()
spaceRouter.post("/createspace",upload.single("spaceImage"),AuthMidddleware,CreateSpace)
spaceRouter.get("/getspace",AuthMidddleware,GetAllSpaces)
spaceRouter.post("/deletespace",AuthMidddleware,DeleteSpace)