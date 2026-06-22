import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import isAuth, { restrictTo } from "../middlewares/auth.js";

const router = express.Router();
router.route("/").get(isAuth, restrictTo('recruiter'), getDashboard);
export default router;
