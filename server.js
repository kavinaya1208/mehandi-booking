// 🔹 Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* =========================
   🔹 MySQL Connection
========================= */

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

/* =========================
   🔹 Thank You Message Function
========================= */

async function sendThankYouMessage(phone, name, service, date) {
  const thankYouMessage = `Thank you ${name} for booking our Mehandi service!

🗓️ Service: ${service}
📅 Date: ${date}

Best regards,
Mehandi Art by Kavinaya`;

  console.log(`📱 Message would be sent to ${phone}`);
  console.log(thankYouMessage);
}

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

      sendThankYouMessage(phone, name, service, date);
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
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid login details" });
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

