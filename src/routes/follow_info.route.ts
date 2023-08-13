import express from "express";
import {followController} from "../controllers/follow_info.controller";
import auth from "../middleware/auth.middleware";

export const followRouter = express.Router();

followRouter.post('/follow',auth, followController.follow);
followRouter.post('/unfollow',auth, followController.unfollow);
followRouter.get('/following',auth, followController.following_list);
followRouter.get('/follower',auth, followController.follower_list);