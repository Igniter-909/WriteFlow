import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.middleware';

const router = express.Router();

router.get("/",protectRoute,getNotifications)
router.delete("/delete",protectRoute,deleteNotifications)

export default router;