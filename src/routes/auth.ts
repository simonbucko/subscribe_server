import express from "express";
import {body,validationResult} from "express-validator"
import User from "../models/user"
import bcrypt from "bcryptjs"

const router = express.Router()

router.post("/signup", body("email").isEmail().withMessage("The email is invalid") , body("password").isLength({min:5}).withMessage("The password should have at least 5 characters"),async (req,res) => {
    //returns array of errors
    const validationsErrors = validationResult(req)
    if(!validationsErrors.isEmpty()){
        const errors = validationsErrors.array().map(error => ({
            msg: error.msg
        }));
        return res.json({errors,data:null})
    }
    const {email,password} = req.body;
    const user = await User.findOne({email})

    if(user){
        return res.json({
            errors: [
                {
                    msg: "Email already in use"
                }
            ],
            data: null
        })
    }

})

export default router
