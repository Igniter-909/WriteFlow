import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { deletePost,createPost,likeUnlikePost,commentOnPost,getAllPosts,getFollowingPost,getLikedPost,getUserPost } from "../controllers/post.controller.js";

const router = express.Router();

router.delete('/:id',protectRoute,deletePost)
router.post('/create',protectRoute,createPost)
router.post('/like/:id',protectRoute,likeUnlikePost)
router.post('/comment/:id',protectRoute,commentOnPost)
router.get('/all',protectRoute,getAllPosts)
router.get('/following',protectRoute,getFollowingPost)
router.get('/likes/:id',protectRoute,getLikedPost)
router.get('/user/:username',protectRoute,getUserPost)

export default router;