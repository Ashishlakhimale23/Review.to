import express from "express"
import {  handlecornjob, handlelogin, handlesignin } from "../controllers/user"
export const UserRouter = express.Router()
UserRouter.post("/signup",handlesignin)
UserRouter.post("/login",handlelogin)
UserRouter.get('/cornjob',handlecornjob)