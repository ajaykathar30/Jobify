import { getAdminJobs, getAlljob,postJob,getJobById,updateJobStatus } from "../controllers/job.controller.js";
import isAuth, { restrictTo } from "../middlewares/auth.js";
import express from "express";

const router=express.Router()
router.route('/post').post(isAuth,restrictTo('recruiter'),postJob)
router.route('/get').get(getAlljob)
router.route('/get/:id').get(isAuth,getJobById)
router.route('/getadminjobs').get(isAuth,restrictTo('recruiter'),getAdminJobs)
router.route('/:id/status/update').post(isAuth,restrictTo('recruiter'),updateJobStatus)
export default router
