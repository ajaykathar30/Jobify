import Job from "../models/job.js";
import Application from "../models/application.js";
import { rankApplicants } from "./rankApplicants.js";
import { normalizeScores } from "../utils/normalizeScores.js";

export const getRecruiterDashboard = async (recruiterId) => {
  const jobs = await Job.find({ created_by: recruiterId });
  const jobIds = jobs.map(j => j._id);
  const now = new Date();

  const isOpen = (job) => job.status !== "closed" && (!job.deadline || job.deadline > now);
  const openJobs = jobs.filter(isOpen).length;

  const applications = await Application.find({ job: { $in: jobIds } });
  const accepted = applications.filter(a => a.status === "accepted").length;
  const rejected = applications.filter(a => a.status === "rejected").length;
  const decided = accepted + rejected;

  // Applications received per day, last 30 days, zero-filled
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });
  const countsByDay = {};
  for (const app of applications) {
    const day = app.createdAt.toISOString().slice(0, 10);
    countsByDay[day] = (countsByDay[day] || 0) + 1;
  }
  const applicationsOverTime = days.map(date => ({ date, count: countsByDay[date] || 0 }));

  // Match scores per job, reusing the existing ranking service - one job's failure
  // (e.g. no job embeddings yet) shouldn't break the whole dashboard.
  const rankedByJob = await Promise.all(
    jobs.map(job => rankApplicants(job._id).catch(() => []))
  );

  let allNormalized = [];
  const perJob = jobs.map((job, i) => {
    const jobApplications = applications.filter(a => a.job.toString() === job._id.toString());
    const ranked = rankedByJob[i];
    const normalized = ranked.length ? normalizeScores(ranked, r => r.score) : [];
    allNormalized = allNormalized.concat(normalized);
    return {
      jobId: job._id,
      title: job.title,
      status: isOpen(job) ? "open" : "closed",
      totalApplicants: jobApplications.length,
      pending: jobApplications.filter(a => a.status === "pending").length,
      accepted: jobApplications.filter(a => a.status === "accepted").length,
      rejected: jobApplications.filter(a => a.status === "rejected").length,
      avgMatchScore: normalized.length ? Math.round(normalized.reduce((a, b) => a + b, 0) / normalized.length) : null
    };
  });

  return {
    totalJobs: jobs.length,
    openJobs,
    closedJobs: jobs.length - openJobs,
    totalApplications: applications.length,
    acceptanceRate: decided ? Math.round((accepted / decided) * 100) : null,
    avgMatchScore: allNormalized.length ? Math.round(allNormalized.reduce((a, b) => a + b, 0) / allNormalized.length) : null,
    applicationsOverTime,
    perJob
  };
};
