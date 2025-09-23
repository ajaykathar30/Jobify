import express from 'express'
import { getApplicants,getApplications,updateApplicationStatus,applyJob } from "../controllers/application.controller.js";
import isAuth from "../middlewares/auth.js";

const router=express.Router()

router.route('/apply/:id').get(isAuth,applyJob)
router.route('/get').get(isAuth,getApplications)
router.route('/:id/applicants').get(isAuth,getApplicants)
router.route('/status/:id/update').post(isAuth,updateApplicationStatus)
export default router


