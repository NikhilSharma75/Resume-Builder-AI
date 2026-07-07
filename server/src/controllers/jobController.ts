// // // import { Request, Response } from "express";
// // // import https from "https";

// // // // @desc Get Jobs from RapidAPI (JSearch)
// // // // @route GET /api/jobs/search
// // // export const searchJobs = async (req: Request, res: Response) => {
// // //   try {
// // //     const query =
// // //       (req.query.keyword as string) || "software developer jobs in India";

// // //     const page = (req.query.page as string) || "1";
// // //     const num_pages = (req.query.num_pages as string) || "1";
// // //     const country = (req.query.country as string) || "in";
// // //     const date_posted = (req.query.posted_days as string) || "all";

// // //     const path = `/search?query=${encodeURIComponent(
// // //       query
// // //     )}&page=${page}&num_pages=${num_pages}&country=${country}&date_posted=${date_posted}`;

// // //     const options = {
// // //       method: "GET",
// // //       hostname: "jsearch.p.rapidapi.com",
// // //       path,
// // //       headers: {
// // //         "x-rapidapi-key": process.env.RAPID_API_KEY!,
// // //         "x-rapidapi-host": "jsearch.p.rapidapi.com",
// // //       },
// // //     };

// // //     const apiReq = https.request(options, (apiRes) => {
// // //       const chunks: Buffer[] = [];

// // //       apiRes.on("data", (chunk) => chunks.push(chunk));

// // //       apiRes.on("end", () => {
// // //         try {
// // //           const body = Buffer.concat(chunks);
// // //           const data = JSON.parse(body.toString());

// // //           const rawJobs = data?.data || [];

// // //           const jobs = rawJobs.map((job: any) => ({
// // //             title: job.job_title,
// // //             company: job.employer_name,
// // //             location: `${job.job_city || ""}, ${job.job_country || ""}`,
// // //             applyLink: job.job_apply_link,
// // //             description: job.job_description || "",
// // //             score: Math.floor(Math.random() * 40) + 60,
// // //             experience: "Not specified",
// // //             job_type: job.job_employment_type || "Unknown",
// // //             salary_min: job.job_min_salary || "Unknown",
// // //             salary_max: job.job_max_salary || "Unknown",
// // //             salary_currency: job.job_salary_currency || "",
// // //             posted_at: job.job_posted_at_datetime_utc || "Recently",
// // //           }));

// // //           res.json({
// // //             total: jobs.length,
// // //             jobs,
// // //           });
// // //         } catch (err) {
// // //           console.error("Parse Error:", err);
// // //           res.status(500).json({ message: "Failed to parse API response" });
// // //         }
// // //       });
// // //     });

// // //     apiReq.on("error", (error) => {
// // //       console.error("API Error:", error);
// // //       res.status(500).json({ message: "External API Error" });
// // //     });

// // //     apiReq.end();
// // //   } catch (error: any) {
// // //     console.error("Server Error:", error);
// // //     res.status(500).json({ message: error.message });
// // //   }
// // // };

// import { Request, Response } from "express";
// import https from "https";
// import Resume from '../models/Resume';

// // @desc Get Jobs from RapidAPI (JSearch)
// // @route GET /api/jobs/search
// export const searchJobs = async (req: Request, res: Response) => {
//   try {
//     let query = (req.query.keyword as string) || "";
//     const resumeId = req.query.resumeId as string;

//     // If no keyword provided, try to get from resume
//     if ((!query || query.trim() === "") && resumeId) {
//       try {
//         const resume = await Resume.findById(resumeId).lean();
        
//         if (resume) {
//           // Check different possible structures
//           const jobTitle = 
//             (resume as any).personalInfo?.jobTitle || 
//             (resume as any).jobTitle || 
            
//             "";
          
//           if (jobTitle) {
//             query = `${jobTitle} jobs`;
//             console.log('📋 Using resume job title:', query);
//           }
//         }
//       } catch (err) {
//         console.log('Could not fetch resume, using default');
//       }
//     }

//     // Final fallback
//     if (!query || query.trim() === "") {
//       query = "software developer jobs in India";
//     }

//     // Add location if specified
//     const location = req.query.location as string;
//     if (location && !query.toLowerCase().includes(location.toLowerCase())) {
//       query += ` in ${location}`;
//     }

//     const page = (req.query.page as string) || "1";
//     const num_pages = (req.query.num_pages as string) || "1";
//     const country = (req.query.country as string) || "in";
//     const date_posted = (req.query.posted_days as string) || "all";

//     const path = `/search?query=${encodeURIComponent(
//       query
//     )}&page=${page}&num_pages=${num_pages}&country=${country}&date_posted=${date_posted}`;

//     console.log('🔍 Searching with query:', query);

//     const options = {
//       method: "GET",
//       hostname: "jsearch.p.rapidapi.com",
//       path,
//       headers: {
//         "x-rapidapi-key": process.env.RAPID_API_KEY!,
//         "x-rapidapi-host": "jsearch.p.rapidapi.com",
//       },
//     };

//     const apiReq = https.request(options, (apiRes) => {
//       const chunks: Buffer[] = [];

//       apiRes.on("data", (chunk) => chunks.push(chunk));

//       apiRes.on("end", () => {
//         try {
//           const body = Buffer.concat(chunks);
//           const data = JSON.parse(body.toString());

//           const rawJobs = data?.data || [];

//           const jobs = rawJobs.map((job: any) => ({
//             title: job.job_title,
//             company: job.employer_name,
//             location: `${job.job_city || ""}, ${job.job_country || ""}`,
//             applyLink: job.job_apply_link,
//             description: job.job_description || "",
//             score: Math.floor(Math.random() * 40) + 60,
//             experience: "Not specified",
//             job_type: job.job_employment_type || "Unknown",
//             salary_min: job.job_min_salary || "Unknown",
//             salary_max: job.job_max_salary || "Unknown",
//             salary_currency: job.job_salary_currency || "",
//             posted_at: job.job_posted_at_datetime_utc || "Recently",
//           }));

//           res.json({
//             total: jobs.length,
//             jobs,
//             searchedQuery: query,
//           });
//         } catch (err) {
//           console.error("Parse Error:", err);
//           res.status(500).json({ message: "Failed to parse API response" });
//         }
//       });
//     });

//     apiReq.on("error", (error) => {
//       console.error("API Error:", error);
//       res.status(500).json({ message: "External API Error" });
//     });

//     apiReq.end();
//   } catch (error: any) {
//     console.error("Server Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

import { Request, Response } from "express";
import https from "https";
import Resume from '../models/Resume';

// @desc Get Jobs from RapidAPI (JSearch)
// @route GET /api/jobs/search
export const searchJobs = async (req: Request, res: Response) => {
  try {
    let query = "";
    const resumeId = req.query.resumeId as string;
    const manualKeyword = (req.query.keyword as string) || "";
    const location = (req.query.location as string) || "";

    // Check if user manually typed a role
    if (manualKeyword && manualKeyword.trim() !== "" && !manualKeyword.includes("undefined")) {
      // User typed something - use it
      query = manualKeyword;
    } else if (resumeId) {
      // No manual input - extract from resume
      try {
        const resume = await Resume.findById(resumeId).lean();
        
        if (resume) {
          const jobTitle = (resume as any).personalInfo?.jobTitle || "";
          
          if (jobTitle) {
            query = `${jobTitle} jobs`;
            console.log('📋 Extracted from resume:', query);
          }
        }
      } catch (err) {
        console.log('Could not fetch resume');
      }
    }

    // Final fallback
    if (!query || query.trim() === "") {
      query = "software developer jobs in India";
    }

    // Add location to query if not already present
    if (location && !query.toLowerCase().includes(location.toLowerCase())) {
      query += ` in ${location}`;
    }

    const page = (req.query.page as string) || "1";
    const num_pages = (req.query.num_pages as string) || "1";
    const country = (req.query.country as string) || "in";
    const date_posted = (req.query.posted_days as string) || "all";

    const path = `/search?query=${encodeURIComponent(
      query
    )}&page=${page}&num_pages=${num_pages}&country=${country}&date_posted=${date_posted}`;

    console.log('🔍 Final query:', query);

    const options = {
      method: "GET",
      hostname: "jsearch.p.rapidapi.com",
      path,
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY!,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    };

    const apiReq = https.request(options, (apiRes) => {
      const chunks: Buffer[] = [];

      apiRes.on("data", (chunk) => chunks.push(chunk));

      apiRes.on("end", () => {
        try {
          const body = Buffer.concat(chunks);
          const data = JSON.parse(body.toString());

          const rawJobs = data?.data || [];

          const jobs = rawJobs.map((job: any) => ({
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city || ""}, ${job.job_country || ""}`,
            applyLink: job.job_apply_link,
            description: job.job_description || "",
            score: Math.floor(Math.random() * 40) + 60,
            experience: "Not specified",
            job_type: job.job_employment_type || "Unknown",
            salary_min: job.job_min_salary || "Unknown",
            salary_max: job.job_max_salary || "Unknown",
            salary_currency: job.job_salary_currency || "",
            posted_at: job.job_posted_at_datetime_utc || "Recently",
          }));

          res.json({
            total: jobs.length,
            jobs,
            searchedQuery: query,
          });
        } catch (err) {
          console.error("Parse Error:", err);
          res.status(500).json({ message: "Failed to parse API response" });
        }
      });
    });

    apiReq.on("error", (error) => {
      console.error("API Error:", error);
      res.status(500).json({ message: "External API Error" });
    });

    apiReq.end();
  } catch (error: any) {
    console.error("Server Error:", error);
    res.status(500).json({ message: error.message });
  }
};