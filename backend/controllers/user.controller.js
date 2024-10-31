import Notification from "../models/notification.model.js";
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import {v2 as cloudinary } from 'cloudinary'

export const getUserProfile = async (req,res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({username}).select("-password");
        console.log(username)
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(201).json(user);
    } catch (error) {
        console.log("Error occurred in getUserprofile,",error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export const followUnfollow = async(req,res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(id===req.user._id.toString()){
            return res.status(400).json({message:"You cannot follow/unfollow yourself"});
        }
        if(!userToModify || !currentUser) {
            res.status(404).json({message:"User not found"});
        }

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
            res.status(200).json({message:"User unfollowd successfully"})
        }else{
            //follow
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});

            const newNotification = new Notification({
                from:req.user._id,
                to:userToModify._id,
                type:'follow'
            });
            await newNotification.save();

            res.status(200).json({message:"User followed successfully"})
        }

    } catch (error) {
        console.log("Error occurred in followUnfolow, ",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export const getSuggestions = async (req,res) => {
    try {
        const userId = req.user._id;
        const usersFollowdByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match:{
                    _id : {$ne:userId}
                }
            },
            { $sample:{size:10}}
        ]);

        const filterUsers = users.filter((user) => !usersFollowdByMe.following.includes(user._id));
        const suggestedUsers = filterUsers.slice(0,4);

        suggestedUsers.forEach((user)=> (user.password=null));
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("error occurred in getSuggestions",error.message);
        res.status(500).json({error:error.message});
    }
}

export const updateProfile = async (req, res) => {
	const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });
		if (currentPassword && !newPassword) {
            return res.status(400).json({ error: "New password is required to update the password" });
        }
        if (newPassword && !currentPassword) {
            return res.status(400).json({ error: "Current password is required to update the password" });
        }
        

		if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "New password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        

		if (profileImg) {
			if (user.profileImg) {
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullName = fullName || user.fullName;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		user.password = null;
		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};