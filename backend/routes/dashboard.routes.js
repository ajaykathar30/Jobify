import express from "express";
import { getDashboard } from "../controllers/dashboard.controller.js";
import isAuth from "../middlewares/auth.js";

const router = express.Router();
router.route("/").get(isAuth, getDashboard);
export default router;
