const express = require("express")
const router = express.Router()

// Get all categories
router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db
    const result = await db.query("SELECT * FROM job_categories ORDER BY name")
    res.json(result.rows)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
