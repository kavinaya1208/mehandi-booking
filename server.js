// 🔹 Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 Serve static files from root folder
app.use(express.static(__dirname));

// 🔥 Set homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/art.html");
});



const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
    return;
  }
  console.log("✅ MySQL connected successfully");
});

app.get("/init-db", (req, res) => {
  db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      phone VARCHAR(20),
      email VARCHAR(255),
      event_date DATE,
      event_time TIME,
      service VARCHAR(255),
      location VARCHAR(255),
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255),
      password VARCHAR(255)
    )
  `);

  res.send("Database initialized successfully");
});
/* =========================
   🔹 Booking API
========================= */

app.post("/api/bookings", (req, res) => {
  const { name, phone, email, date, time, service, location, message } = req.body;

  const sql = `
    INSERT INTO bookings
    (name, phone, email, event_date, event_time, service, location, message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, phone, email, date, time, service, location, message],
    (err, result) => {
      if (err) {
        console.error("SQL Error:", err);
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
});

/* =========================
   🔹 Login API
========================= */

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ success: false });
    }

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  });
});

/* =========================
   🔹 Start Server
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});





