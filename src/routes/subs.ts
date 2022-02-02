import express from "express";
import User from "../models/user"
import { checkAuth } from "../middleware/checkAuth";
import {stripe} from "../utils/stripe"


const router = express.Router()

router.get(`/prices`, checkAuth,async (req,res) => {
    const prices = await stripe.prices.list({
        apiKey: process.env.STRIPE_SECRET_KEY
    })

    return res.json(prices)
})

export default router