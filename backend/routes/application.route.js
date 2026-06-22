import express from 'express'
import { getApplicants,getApplications,updateApplicationStatus,applyJob } from "../controllers/application.controller.js";
import isAuth, { restrictTo } from "../middlewares/auth.js";

const router=express.Router()

router.route('/apply/:id').get(isAuth,restrictTo('student'),applyJob)
router.route('/get').get(isAuth,restrictTo('student'),getApplications)
router.route('/:id/applicants').get(isAuth,restrictTo('recruiter'),getApplicants)
router.route('/status/:id/update').post(isAuth,restrictTo('recruiter'),updateApplicationStatus)
export default router


