import analyzeResume from "../services/analyzeResume.js";
import { getJobRecommendations } from "../services/jobRecommendations.js";

export const analyzeResumeController = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware

    const analysis = await analyzeResume(userId);

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};