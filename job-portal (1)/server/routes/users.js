const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const router = express.Router()

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id

    const query = `
      SELECT id, email, first_name, last_name, role, phone, location, 
             company_name, company_description, resume_url, profile_image, created_at
      FROM users 
      WHERE id = $1
    `

    const result = await db.query(query, [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = result.rows[0]
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      phone: user.phone,
      location: user.location,
      companyName: user.company_name,
      companyDescription: user.company_description,
      resumeUrl: user.resume_url,
      profileImage: user.profile_image,
      createdAt: user.created_at,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db
    const userId = req.user.id
    const { firstName, lastName, phone, location, companyName, companyDescription, resumeUrl } = req.body

    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, phone = $3, location = $4, 
          company_name = $5, company_description = $6, resume_url = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, email, first_name, last_name, role, phone, location, 
                company_name, company_description, resume_url, profile_image, created_at
    `

    const values = [firstName, lastName, phone, location, companyName, companyDescription, resumeUrl, userId]
    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = result.rows[0]
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        phone: user.phone,
        location: user.location,
        companyName: user.company_name,
        companyDescription: user.company_description,
        resumeUrl: user.resume_url,
        profileImage: user.profile_image,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
