import express from "express";
import User from "../models/user"
import { checkAuth } from "../middleware/checkAuth";
import {stripe} from "../utils/stripe"
import Article from "../models/article";


const router = express.Router()

router.get("/",checkAuth, async(req,res) => {
    //fetch user to get customerStripeId and find out which subs they have
    const user = await User.findOne({email: req.user})

    const subscriptions = await stripe.subscriptions.list({
        customer: user.customerStripeId,
        status: "all",
        expand: ["data.default_payment_method"]
    }, {
        apiKey: process.env.STRIPE_SECRET_KEY
    })

    //if they are no articles return nothing
    if(!subscriptions.data.length) return res.json([])

    //@ts-ignore
    const plan = subscriptions.data[0].plan.nickname

    //this is not a good practice and should be in reverse order

    if(plan === "Basic"){
        const articles = await Article.find({access: "Basic"})
        return res.json(articles)
    }
    else if(plan === "Standard"){
        const articles = await Article.find({access: {$in: ["Basic","Standard"]}})
        return res.json(articles)
    }
    else{
        const articles = await Article.find({})
        return res.json(articles)
    }

})


export default router