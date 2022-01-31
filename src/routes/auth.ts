import express from "express";
import {body,validationResult} from "express-validator"

const router = express.Router()

router.post("/signup", body("email").isEmail().withMessage("The email is invalid") , body("password").isLength({min:5}).withMessage("The password should have at least 5 characters"),async (req,res) => {
    //returns array of errors
    const validationsErrors = validationResult(req)
    if(!validationsErrors.isEmpty()){
        const errors = validationsErrors.array().map(error => ({
            msg: error.msg
        }));
        res.json({errors})
    }
    const {email , password} = req.body;
    res.json({email,password})

})

export default router
