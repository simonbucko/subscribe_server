import express from "express"
import authRoutes from "./routes/auth"
import mongoose from "mongoose"
import dotenv from "dotenv"

const app = express()
dotenv.config()

//allows utilize JSON body in request
app.use(express.json())
app.use("/auth", authRoutes)

mongoose.connect(process.env.MONGO_URI as string)
    .then(()=>{
        console.log("Connected to DB")
        app.listen(8080,()=>{
            console.log("Server is runnig on port 8080")
        })
    })
    .catch(() => {
        throw new Error()
    })

