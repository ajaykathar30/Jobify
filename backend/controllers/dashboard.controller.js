import { getRecruiterDashboard } from "../services/recruiterDashboard.js";

export const getDashboard = async (req, res) => {
  try {
    const data = await getRecruiterDashboard(req.id);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
