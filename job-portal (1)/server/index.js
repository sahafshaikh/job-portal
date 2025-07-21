const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { Pool } = require("pg")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "job_portal",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
})

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err)
  } else {
    console.log("Connected to PostgreSQL database")
    release()
  }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Make pool available to routes
app.locals.db = pool

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/jobs", require("./routes/jobs"))
app.use("/api/applications", require("./routes/applications"))
app.use("/api/categories", require("./routes/categories"))
app.use("/api/admin", require("./routes/admin"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Job Portal API is running!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
