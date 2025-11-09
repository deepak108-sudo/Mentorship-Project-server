import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String, 
        required:true, 
        unique:true, 
        trim:true, 
        lowercase:true
    },
    password:{
        type:String, 
        require:true, 
        minLength:4
    },
    role: {
        type:String,
        enums:["student","mentor","admin"],
        required:true,
    },
},{timestamps: true, strict:true});

const User = mongoose.model("User",userSchema);

export default User;