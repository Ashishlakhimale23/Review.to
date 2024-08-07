import { NextFunction,Request,Response } from "express"
import admin from "../utils/firebaseadmin"

export const AuthMidddleware=async(req:Request,res:Response,next:NextFunction)=>{
    let token = req.headers.Authorization || req.headers.authorization
    console.log(token)
    if(typeof token !== "string" || !token?.startsWith("Bearer ")){
        return res.json({message:"unauthorized"})
    }else{
        try{
            const authtoken = token.split(" ")[1]
            let checkrevoked = true 
            await admin.auth().verifyIdToken(authtoken,checkrevoked).then((payload)=>{
                console.log(payload)
                req.body.uid = payload.uid 
                next()
            }).catch((error)=>{
                console.log(error)
                let errormessage = error.code
                if(errormessage == 'auth/id-token-revoked' || errormessage== 'auth/id-token-expired'){
                    return res.status(401).json({message:"token expired"}).end()
                }else{
                    return res.json({message:"unauthorized"})
                }
            })

        }catch(error){
            
            return res.json({message:"unauthorized"})
        }
    } 
 

} 