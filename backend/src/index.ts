import express, { urlencoded } from "express";
import { UserRouter } from "./routes/user";
import { connection } from "./connection";
import { config } from "dotenv";
import cors from "cors"
import { spaceRouter } from "./routes/space";
config()
const dburl:string = process.env.DB_URL!

const app = express()
app.use(cors())
app.use(urlencoded({extended:false}))
app.use(express.json())
app.use('/user',UserRouter)
app.use('/space',spaceRouter)
connection(dburl).then(()=>{
app.listen(process.env.PORT || 3000,()=>{
  console.log("server started")
})
})
