import express from 'express'
import { register } from '../controllers/user.controller.js'
import { login } from '../controllers/user.controller.js'
import { updateProfile} from '../controllers/user.controller.js'
import { logout } from '../controllers/user.controller.js'
import { toggleSavedJob, getSavedJobs } from '../controllers/user.controller.js'
import isAuth from '../middlewares/auth.js'
import { singleUpload } from '../middlewares/multer.js'

const router=express.Router()
router.route('/register').post(singleUpload,register)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/profile/update').post(isAuth,singleUpload,updateProfile)
router.route('/savedJobs/:jobId/toggle').post(isAuth,toggleSavedJob)
router.route('/savedJobs').get(isAuth,getSavedJobs)

export default router