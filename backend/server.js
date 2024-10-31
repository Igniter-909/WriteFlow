import express from "express";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from './routes/post.route.js'
import notificationRoutes from "./routes/notification.route.js"
import dotenv from 'dotenv'
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary'
import router from "./routes/auth.route.js";

dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLODINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT)
    connectMongoDB();
});

//ivMP42cjy9rxYUP1