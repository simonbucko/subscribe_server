import mongoose from "mongoose"
const {Schema} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 5
    },
    customerStripeId:{
        type:String,
        required: true,
        
    }
})

export default mongoose.model("User",userSchema)