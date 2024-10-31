import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async(req,res) => {
    try {
        const {fullName,username,email,password} = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"})
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error:"Username is already taken"})
        }

        const existinEmail = await User.findOne({email});
        if(existinEmail) {
            return res.status(400).json({error:"Email is already taken"})
        }

        if(password.length<6) {
            return res.status(400).json({error:"Password length should be greater than 6"})
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName:fullName,
            username:username,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,
            })
        }else{
            res.status(400).json({error:"Invalid user data"})
        }



    } catch (error) {
        console.log("error in signup controller")
        res.status(500).json({error:"Internal server error"})
    }
}

export const login = async(req,res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordValid = await bcrypt.compare(password,user.password || "");
        if(!user || !isPasswordValid){
            return res.status(401).json({error:"Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,
        })
    } catch (error) {
        console.log("error in login controller:",error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const logout = async(req,res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged Out Successfully"});
    } catch (error) {
        console.log("Error in logout controller")
        res.status(500).json({error:"Internal server error"})
    }
}

export const getMe = async(req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getme function",error.message)
        res.status(500).json({error:"Internal server error"})
    }
}