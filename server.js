const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // Try 465 first (SSL)
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'nexurargpv@gmail.com',
        pass: 'mcnpytqxzukmwscu' // App Password 
    }
});

// Contact Form Route
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    console.log(req.body);

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    const mailOptions = {
        from: email,
        to: 'nexurargpv@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Message sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
