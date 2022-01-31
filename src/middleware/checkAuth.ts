import {Request,Response,NextFunction} from "express"
import JWT from "jsonwebtoken"

export const checkAuth = async (req:Request,res:Response,next:NextFunction) => {
    let token = req.header("authorization")
    if(!token){
        return res.status(403).json({
            errors:[
                {
                    msg: "Unauthorized"
                }
            ]
        })
    }

    token = token.split(" ")[1]
} 