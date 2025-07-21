const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

// Get all jobs with pagination and filters
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db
    const { page = 1, limit = 10, search, location, jobType, categoryId } = req.query
    const offset = (page - 1) * limit

    let query = `
      SELECT j.*, u.company_name, u.first_name, u.last_name, c.name as category_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE j.is_active = true
    `

    const queryParams = []
    let paramCount = 0

    if (search) {
      paramCount++
      query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`
      queryParams.push(`%${search}%`)
    }

    if (location) {
      paramCount++
      query += ` AND j.location ILIKE $${paramCount}`
      queryParams.push(`%${location}%`)
    }

    if (jobType) {
      paramCount++
      query += ` AND j.job_type = $${paramCount}`
      queryParams.push(jobType)
    }

    if (categoryId) {
      paramCount++
      query += ` AND j.category_id = $${paramCount}`
      queryParams.push(categoryId)
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    queryParams.push(limit, offset)

    const result = await db.query(query, queryParams)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) FROM jobs j
      WHERE j.is_active = true
    `
    const countParams = []
    let countParamCount = 0

    if (search) {
      countParamCount++
      countQuery += ` AND (j.title ILIKE $${countParamCount} OR j.description ILIKE $${countParamCount})`
      countParams.push(`%${search}%`)
    }

    if (location) {
      countParamCount++
      countQuery += ` AND j.location ILIKE $${countParamCount}`
      countParams.push(`%${location}%`)
    }

    if (jobType) {
      countParamCount++
      countQuery += ` AND j.job_type = $${countParamCount}`
      countParams.push(jobType)
    }

    if (categoryId) {
      countParamCount++
      countQuery += ` AND j.category_id = $${countParamCount}`
      countParams.push(categoryId)
    }

    const countResult = await db.query(countQuery, countParams)
    const totalJobs = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalJobs / limit)

    res.json({
      jobs: result.rows,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalJobs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params

    const query = `
      SELECT j.*, u.company_name, u.first_name, u.last_name, u.company_description, c.name as category_name
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN job_categories c ON j.category_id = c.id
      WHERE j.id = $1 AND j.is_active = true
    `

    const result = await db.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Create job (employers only)
router.post("/", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { title, description, requirements, salaryMin, salaryMax, location, jobType, categoryId } = req.body
    const employerId = req.user.id

    const query = `
      INSERT INTO jobs (title, description, requirements, salary_min, salary_max, location, job_type, category_id, employer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const values = [title, description, requirements, salaryMin, salaryMax, location, jobType, categoryId, employerId]
    const result = await db.query(query, values)

    res.status(201).json({
      message: "Job created successfully",
      job: result.rows[0],
    })
  } catch (error) {
    console.error("Create job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Update job (employers only - own jobs)
router.put("/:id", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params
    const { title, description, requirements, salaryMin, salaryMax, location, jobType, categoryId } = req.body
    const employerId = req.user.id

    // Check if job belongs to the employer
    const checkQuery = "SELECT * FROM jobs WHERE id = $1 AND employer_id = $2"
    const checkResult = await db.query(checkQuery, [id, employerId])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" })
    }

    const query = `
      UPDATE jobs 
      SET title = $1, description = $2, requirements = $3, salary_min = $4, salary_max = $5, 
          location = $6, job_type = $7, category_id = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND employer_id = $10
      RETURNING *
    `

    const values = [
      title,
      description,
      requirements,
      salaryMin,
      salaryMax,
      location,
      jobType,
      categoryId,
      id,
      employerId,
    ]
    const result = await db.query(query, values)

    res.json({
      message: "Job updated successfully",
      job: result.rows[0],
    })
  } catch (error) {
    console.error("Update job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete job (employers only - own jobs)
router.delete("/:id", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params
    const employerId = req.user.id

    const query = "DELETE FROM jobs WHERE id = $1 AND employer_id = $2 RETURNING *"
    const result = await db.query(query, [id, employerId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized" })
    }

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get employer's jobs
router.get("/employer/my-jobs", authenticateToken, authorizeRoles("employer"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const employerId = req.user.id

    const query = `
      SELECT j.*, c.name as category_name,
             COUNT(ja.id) as application_count
      FROM jobs j
      LEFT JOIN job_categories c ON j.category_id = c.id
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      WHERE j.employer_id = $1
      GROUP BY j.id, c.name
      ORDER BY j.created_at DESC
    `

    const result = await db.query(query, [employerId])
    res.json(result.rows)
  } catch (error) {
    console.error("Get employer jobs error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
