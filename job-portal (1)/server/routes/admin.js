const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/auth")
const router = express.Router()

// Get dashboard statistics (admin only)
router.get("/dashboard", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const db = req.app.locals.db

    // Get total counts
    const usersResult = await db.query("SELECT COUNT(*) FROM users")
    const jobsResult = await db.query("SELECT COUNT(*) FROM jobs")
    const applicationsResult = await db.query("SELECT COUNT(*) FROM job_applications")
    const employersResult = await db.query("SELECT COUNT(*) FROM users WHERE role = $1", ["employer"])
    const jobSeekersResult = await db.query("SELECT COUNT(*) FROM users WHERE role = $1", ["job_seeker"])

    // Get recent activities
    const recentJobsResult = await db.query(`
      SELECT j.title, j.created_at, u.company_name 
      FROM jobs j 
      JOIN users u ON j.employer_id = u.id 
      ORDER BY j.created_at DESC 
      LIMIT 5
    `)

    const recentApplicationsResult = await db.query(`
      SELECT ja.applied_at, j.title, u.first_name, u.last_name
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON ja.job_seeker_id = u.id
      ORDER BY ja.applied_at DESC
      LIMIT 5
    `)

    res.json({
      statistics: {
        totalUsers: Number.parseInt(usersResult.rows[0].count),
        totalJobs: Number.parseInt(jobsResult.rows[0].count),
        totalApplications: Number.parseInt(applicationsResult.rows[0].count),
        totalEmployers: Number.parseInt(employersResult.rows[0].count),
        totalJobSeekers: Number.parseInt(jobSeekersResult.rows[0].count),
      },
      recentJobs: recentJobsResult.rows,
      recentApplications: recentApplicationsResult.rows,
    })
  } catch (error) {
    console.error("Get dashboard error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get all users (admin only)
router.get("/users", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { page = 1, limit = 10, role } = req.query
    const offset = (page - 1) * limit

    let query = `
      SELECT id, email, first_name, last_name, role, phone, location, 
             company_name, created_at
      FROM users
      WHERE role != 'admin'
    `

    const queryParams = []
    let paramCount = 0

    if (role) {
      paramCount++
      query += ` AND role = $${paramCount}`
      queryParams.push(role)
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    queryParams.push(limit, offset)

    const result = await db.query(query, queryParams)

    // Get total count
    let countQuery = "SELECT COUNT(*) FROM users WHERE role != $1"
    const countParams = ["admin"]

    if (role) {
      countQuery += " AND role = $2"
      countParams.push(role)
    }

    const countResult = await db.query(countQuery, countParams)
    const totalUsers = Number.parseInt(countResult.rows[0].count)
    const totalPages = Math.ceil(totalUsers / limit)

    res.json({
      users: result.rows,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Get all jobs (admin only)
router.get("/jobs", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const query = `
      SELECT j.*, u.company_name, u.first_name, u.last_name, c.name as category_name,
             COUNT(ja.id) as application_count
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      LEFT JOIN job_categories c ON j.category_id = c.id
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      GROUP BY j.id, u.company_name, u.first_name, u.last_name, c.name
      ORDER BY j.created_at DESC
      LIMIT $1 OFFSET $2
    `

    const result = await db.query(query, [limit, offset])

    // Get total count
    const countResult = await db.query("SELECT COUNT(*) FROM jobs")
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
    console.error("Get admin jobs error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete user (admin only)
router.delete("/users/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params

    // Prevent deleting admin users
    const userCheck = await db.query("SELECT role FROM users WHERE id = $1", [id])
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    if (userCheck.rows[0].role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" })
    }

    const result = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete job (admin only)
router.delete("/jobs/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const db = req.app.locals.db
    const { id } = req.params

    const result = await db.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
