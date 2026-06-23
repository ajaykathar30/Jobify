// Several services throw plain Error objects with messages like "Job not
// found" / "No resume found" - this maps those to a 404 instead of letting
// every thrown error fall back to a generic 500.
export const statusFromError = (error) => /not found|no .*found/i.test(error.message) ? 404 : 500;
