import { analyzeResumeController, jobRecommendationsController } from '../controllers/ai.controller.js';
import isAuth, { restrictTo } from '../middlewares/auth.js';
import express from 'express'

const router=express.Router()
router.route("/analyzeResume").post(isAuth,restrictTo('student'),analyzeResumeController);
router.route("/jobRecommendations").get(isAuth,restrictTo('student'),jobRecommendationsController);
export default router