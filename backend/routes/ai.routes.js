import { analyzeResumeController, jobRecommendationsController } from '../controllers/ai.controller.js';
import isAuth from '../middlewares/auth.js';
import express from 'express'

const router=express.Router()
router.route("/analyzeResume").get(isAuth,analyzeResumeController);
router.route("/jobRecommendations").get(isAuth,jobRecommendationsController);
export default router