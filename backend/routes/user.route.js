import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.middleware.js';
import { getUserProfile,followUnfollow,getSuggestions,updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/profile/:username",protectRoute,getUserProfile)
router.get("/suggested",protectRoute,getSuggestions)
router.post("/follow/:id",protectRoute,followUnfollow)
router.post("/updateProfile",protectRoute,updateProfile)


export default router;