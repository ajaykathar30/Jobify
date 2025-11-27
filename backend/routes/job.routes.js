import { getAdminJobs, getAlljob,postJob,getJobById } from "../controllers/job.controller.js";
import isAuth from "../middlewares/auth.js";
import express from "express";

const router=express.Router()
router.route('/post').post(isAuth,postJob)
router.route('/get').get(getAlljob)
router.route('/get/:id').get(isAuth,getJobById)
router.route('/getadminjobs').get(isAuth,getAdminJobs)
export default router
