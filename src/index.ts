import express from "express"
import authRoutes from "./routes/auth"
import subsRoutes from "./routes/subs"
import articlesRoutes from "./routes/articles"
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
        app.get("/test",(req,res) => res.send("Hello from subscription app API") )
        app.use("/auth", authRoutes)
        app.use("/subs", subsRoutes)
        app.use("/articles", articlesRoutes)
        app.listen(8080,()=>{
            console.log("Server is runnig on port 8080")
        })
    })
    .catch((error) => {
        console.log({error})
        throw new Error(error)
    })

