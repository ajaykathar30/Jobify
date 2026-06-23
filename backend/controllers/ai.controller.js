import analyzeResume from "../services/analyzeResume.js";
import { getJobRecommendations } from "../services/jobRecommendations.js";
import { statusFromError } from "../utils/errorStatus.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware
    const jobDescription = req.body?.jobDescription?.trim() || null;

    if (jobDescription && jobDescription.length > 5000) {
      return res.status(400).json({
        success: false,
        message: "Job description is too long (max 5000 characters)"
      });
    }

    const analysis = await analyzeResume(userId, jobDescription);

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error(error);
    res.status(statusFromError(error)).json({
      success: false,
      message: error.message
    });
  }
};

export const jobRecommendationsController = async (req, res) => {
  try {
    const jobs = await getJobRecommendations(req.id);
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(statusFromError(error)).json({ success: false, message: error.message });
  }
};