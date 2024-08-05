import { NextFunction,Request,Response } from "express"
import admin from "../utils/firebaseadmin"

export const AuthMidddleware=async(req:Request,res:Response,next:NextFunction)=>{
    let token = req.headers.Authorization || req.headers.authorization
    if(!token?.length || typeof token != "string" || token?.startsWith("Bearer ")){
        return res.json({message:"unauthorized"})
    }else{
        try{
            const authtoken = token.split(" ")[1]
            let checkrevoed = true 
            await admin.auth().verifyIdToken(authtoken,checkrevoed).then((payload)=>{
                req.body.uid = payload.uid 
                next()
            }).catch((error)=>{
                let errormessage = error.code
                if(errormessage == 'auth/id-token-revoked'){
                    return res.json({message:"token expired"}).status(401)
                }else{
                    return res.json({message:"unauthorized"})
                }
            })

        }catch(error){
            return res.json({message:"unauthorized"})
        }
    } 
 

} 