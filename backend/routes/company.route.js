import express from 'express'
import isAuth, { restrictTo } from "../middlewares/auth.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from '../middlewares/multer.js';

const router=express.Router()
router.route('/register').post(isAuth,restrictTo('recruiter'),registerCompany)
router.route('/get').get(isAuth,restrictTo('recruiter'),getCompany)
router.route('/get/:id').get(isAuth,restrictTo('recruiter'),getCompanyById)
router.route('/update/:id').put(isAuth,restrictTo('recruiter'),singleUpload,updateCompany)

export default router