import express, { urlencoded } from "express";
import { UserRouter } from "./routes/user";
import { connection } from "./connection";
import { config } from "dotenv";
import cors from "cors"
config()
const dburl:string = process.env.DB_URL!

const app = express()
app.use(cors())
app.use(urlencoded({extended:false}))
app.use(express.json())
app.use('/user',UserRouter)
connection(dburl).then(()=>{
app.listen(8000,()=>{
  console.log("server started")
})
})
