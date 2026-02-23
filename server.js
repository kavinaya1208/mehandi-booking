const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
// const twilio = require("twilio"); // Uncomment after installing twilio

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔹 MySQL connection (update password if needed)
require("dotenv").config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// 🔹 Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("❌ MySQL connection failed:", err.message);
        return;
    }
    console.log("✅ MySQL Connected");
});

// 🔹 Twilio Configuration (Replace with your actual credentials)
// const client = twilio("YOUR_ACCOUNT_SID", "YOUR_AUTH_TOKEN");
// const TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886";

// 🔹 Function to send thank you message
async function sendThankYouMessage(phone, name, service, date) {
    const thankYouMessage = `Thank you ${name} for booking our Mehandi service! 
    
We are delighted to have you!
🗓️ Service: ${service}
📅 Date: ${date}

We look forward to serving you!
For any queries, contact us: +91 9876543210

Best regards,
Mehandi Art by Kavinaya`;

    // For WhatsApp (using Twilio) - Uncomment after configuring Twilio
    /*
    try {
        await client.messages.create({
            body: thankYouMessage,
            from: TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+91${phone}`
        });
        console.log(`✅ Thank you message sent to ${phone}`);
    } catch (error) {
        console.error("❌ Failed to send WhatsApp:", error.message);
    }
    */

    // For SMS (using Twilio) - Uncomment after configuring Twilio
    /*
    try {
        await client.messages.create({
            body: thankYouMessage,
            from: "+1234567890", // Your Twilio phone number
            to: `+91${phone}`
        });
        console.log(`✅ Thank you SMS sent to ${phone}`);
    } catch (error) {
        console.error("❌ Failed to send SMS:", error.message);
    }
    */

    // For now, just log the message (demo mode)
    console.log(`📱 Thank you message would be sent to ${phone}:`);
    console.log(thankYouMessage);
    console.log("---");
}

// 🔹 Booking API
app.post("/api/bookings", (req, res) => {
    console.log("📥 API HIT - Incoming data:", req.body); // 👈 MUST SEE THIS



    const {
        name,
        phone,
        email,
        date,
        time,
        service,
        location,
        message
    } = req.body;

    const sql = `
        INSERT INTO bookings
        (name, phone, email, event_date, event_time, service, location, message)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, phone, email, date, time, service, location, message],
        (err,result) => {
            if (err) {
                console.error("SQL Error:",err);
                return res.status(500).json({ success: false });
            }
            
            // Send thank you message after successful booking
            sendThankYouMessage(phone, name, service, date);
            
            res.json({ success: true });
        }
    );
});

// 🔹 API to send thank you message manually (for confirmed bookings)
app.post("/api/send-thankyou", (req, res) => {
    const { phone, name, service, date } = req.body;
    
    if (!phone || !name) {
        return res.status(400).json({ success: false, message: "Phone and name are required" });
    }
    
    sendThankYouMessage(phone, name, service || "Mehandi Service", date || "Your booking date");
    res.json({ success: true, message: "Thank you message sent!" });
});

// 🔹 Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (result.length > 0) {
            // Login successful
            res.json({ success: true, message: "Login successful" });
        } else {
            // Login failed
            res.status(401).json({ success: false, message: "Invalid login details" });
        }
    });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});





