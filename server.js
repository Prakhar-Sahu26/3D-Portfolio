require('dotenv').config(); // Load environment variables

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Change this if your frontend URL is different

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Route to Handle Contact Form Submissions
app.post('/send', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVE_EMAIL,
        subject: 'New Contact Form Submission',
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ success: false, message: `Email not sent: ${error.message}` });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
