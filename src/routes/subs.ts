import express from "express";
import User from "../models/user"
import { checkAuth } from "../middleware/checkAuth";


const router = express.Router()

router.get(`/prices`, checkAuth,async (req,res) => {
    return res.send("prices")
})

export default router