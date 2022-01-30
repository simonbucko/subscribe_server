import express from "express"
import authRoutes from "./routes/auth"

const app = express()
//allows utilize JSON body in request
app.use(express.json())
app.use("/auth", authRoutes)

app.listen(8080,()=>{
    console.log("Server is runnig on port 8080")
})