import express from "express";
import {body,validationResult} from "express-validator"
import User from "../models/user"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { checkAuth } from "../middleware/checkAuth";
import { stripe } from "../utils/stripe";


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

    const customer = await stripe.customers.create({
        email
    },{
        apiKey: process.env.STRIPE_SECRET_KEY
    })

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await User.create({
        email, password: hashedPassword, customerStripeId: customer.id
    })

    const token = await JWT.sign(
        {email: newUser.email},
        process.env.JWT_SECRET as string,
        {
            expiresIn: 343434343434
        }
    )
    res.json({
        errors: [],
        data: {
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                customerStripeId: customer.id
            }
        }
    })

})


router.post("/login", async (req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email})

    //if user does not exist in db
    if(!user){
        return res.json({
            errors: [
                {
                    msg: "Invalid credentials"
                }
            ],
            data: null
        })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    //passwords does not match
    if(!isMatch){
        return res.json({
            errors: [
                {
                    msg: "Invalid credentials"
                }
            ],
            data: null
        })
    }

    const token = await JWT.sign(
        {email: user.email},
        process.env.JWT_SECRET as string,
        {
            expiresIn: 343434343434
        }
    )
    res.json({
        errors: [],
        data: {
            token,
            user: {
                id: user._id,
                email: user.email
            }
        }
    })

})

router.get("/me", checkAuth, async (req,res) => {
    const user = await User.findOne({email:req.user})
    return res.json({
        errors:[],
        data: {
            user: {
                id: user._id,
                email: user.email,
                customerStripeId: user.customerStripeId
            }
        }
    })

})

export default router
