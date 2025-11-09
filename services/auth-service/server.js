import dotenv from "dotenv"
dotenv.config();

//import libraries
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

//initialize 
const app=express();
const PORT=process.env.PORT || 5000;

//middleware
app.use(express.json());

const startServer=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Successfully Connected ✅`);

        app.use("/api/auth",authRoutes);

        //Start server after connecting database
        app.listen(PORT,()=>{
            console.log(`Auth Service running on port ${PORT}`);
        });
    }
    catch(err){
        console.error(`DB not connected ❌`,err.message);
        process.exit(1);
    }
};

startServer();