import express from "express"
import authRoutes from "./routes/auth"
import subsRoutes from "./routes/subs"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

mongoose.connect(process.env.MONGO_URI as string)
    .then(()=>{
        console.log("Connected to DB")
        const app = express()   
        //allows utilize JSON body in request
        app.use(express.json())
        app.use(cors())
        app.use("/auth", authRoutes)
        app.use("/subs", subsRoutes)
        app.listen(8080,()=>{
            console.log("Server is runnig on port 8080")
        })
    })
    .catch((error) => {
        console.log({error})
        throw new Error(error)
    })

