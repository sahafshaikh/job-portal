const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

// Apply for a job (job seekers only)
router.post("/", authenticateToken, authorizeRoles("job_seeker"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { jobId, coverLetter } = req.body
    const jobSeekerId = req.user.id

    // Check if job exists and is active
    const jobCheck = await db.query("SELECT * FROM jobs WHERE id = $1 AND is_active = true", [jobId])
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or inactive" })
    }

    // Check if already applied
    const existingApplication = await db.query(
      "SELECT * FROM job_applications WHERE job_id = $1 AND job_seeker_id = $2",
      [jobId, jobSeekerId],
    )

    if (existingApplication.rows.length > 0) {
      return res.status(400).json({ message: "You have already applied for this job" })
    }

    // Create application
    const query = `
      INSERT INTO job_applications (job_id, job_seeker_id, cover_letter)
      VALUES ($1, $2, $3)
      RETURNING *
    `

    const result = await db.query(query, [jobId, jobSeekerId, coverLetter])

    res.status(201).json({
      message: "Application submitted successfully",
      application: result.rows[0],
    })
  } catch (error) {
    console.error("Apply for job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get job seeker's applications
router.get("/my-applications", authenticateToken, authorizeRoles("job_seeker"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const jobSeekerId = req.user.id

    const query = `
      SELECT ja.*, j.title, j.location, j.job_type, j.salary_min, j.salary_max,
             u.company_name, u.first_name as employer_first_name, u.last_name as employer_last_name
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON j.employer_id = u.id
      WHERE ja.job_seeker_id = $1
      ORDER BY ja.applied_at DESC
    `

    const result = await db.query(query, [jobSeekerId])
    res.json(result.rows)
  } catch (error) {
    console.error("Get applications error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get applications for employer's jobs
router.get("/employer/applications", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const employerId = req.user.id

    const query = `
      SELECT ja.*, j.title, j.id as job_id,
             u.first_name, u.last_name, u.email, u.phone, u.location, u.resume_url
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON ja.job_seeker_id = u.id
      WHERE j.employer_id = $1
      ORDER BY ja.applied_at DESC
    `

    const result = await db.query(query, [employerId])
    res.json(result.rows)
  } catch (error) {
    console.error("Get employer applications error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Update application status (employers only)
router.put("/:id/status", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params
    const { status } = req.body
    const employerId = req.user.id

    // Verify the application belongs to employer's job
    const checkQuery = `
      SELECT ja.* FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.id = $1 AND j.employer_id = $2
    `

    const checkResult = await db.query(checkQuery, [id, employerId])
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Application not found or unauthorized" })
    }

    const query = `
      UPDATE job_applications 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `

    const result = await db.query(query, [status, id])

    res.json({
      message: "Application status updated successfully",
      application: result.rows[0],
    })
  } catch (error) {
    console.error("Update application status error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get applications for a specific job (employers only)
router.get("/job/:jobId", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { jobId } = req.params
    const employerId = req.user.id

    // Verify job belongs to employer
    const jobCheck = await db.query("SELECT * FROM jobs WHERE id = $1 AND employer_id = $2", [jobId, employerId])
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" })
    }

    const query = `
      SELECT ja.*, u.first_name, u.last_name, u.email, u.phone, u.location, u.resume_url
      FROM job_applications ja
      JOIN users u ON ja.job_seeker_id = u.id
      WHERE ja.job_id = $1
      ORDER BY ja.applied_at DESC
    `

    const result = await db.query(query, [jobId])
    res.json(result.rows)
  } catch (error) {
    console.error("Get job applications error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
