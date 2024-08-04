import mongoose, { ObjectId } from "mongoose"
export interface UserType {
    _id:ObjectId
    email:string,
    username?:string,
    password:string
}