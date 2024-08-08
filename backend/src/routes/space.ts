import express from "express"
import { AuthMidddleware } from "../middlerware/Auth"
import { CreateSpace, DeleteSpace, GetAllSpaces } from "../controllers/space"
export const spaceRouter = express.Router()
spaceRouter.post("/createspace",AuthMidddleware,CreateSpace)
spaceRouter.get("/getspace",AuthMidddleware,GetAllSpaces)
spaceRouter.post("/deletespace",AuthMidddleware,DeleteSpace)