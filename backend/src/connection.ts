import mongoose from "mongoose";

export async function connection (url:string):Promise<void>{
   await mongoose.connect(url).then(()=>console.log("db connected")).catch((err)=> console.error(err))
}