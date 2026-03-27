const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, '/')));


// Serve static files (your frontend)
app.use(express.static(__dirname));

// Optional: serve index.html on root only
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());

/**
 * 1. Route to get "About Me" data
 * This keeps your frontend clean by fetching personal details from the server.
 */
app.get('/api/profile', (req, res) => {
    res.json({
        name: "Rohit Prasad",
        alias: "PrinSanity",
        location: "Hyderabad, TS, India",
        education: "Computer Science Engineering (Btech)",
        stats: { youtubeSubs: "100K+", projects: 12 },
        languages: ["English", "Hindi", "Telugu", "Bhojpuri"]
    });
});

/**
 * 2. Route to handle Contact Form & Email Sending
 * This uses Nodemailer to send an actual email to your inbox.
 */

// SETUP: Replace 'your-16-character-app-password' with the code from Google
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'contact.prinsanity@gmail.com',
        pass: 'ebbk forv pkhh gepk' 
    }
});

app.post('/api/contact', (req, res) => {
    const { email, message } = req.body;

    // Log to terminal so you can see it immediately
    console.log(`Received proposal from: ${email}`);

    const mailOptions = {
        from: 'contact.prinsanity@gmail.com',
        to: 'contact.prinsanity@gmail.com', // Sends the email to yourself
        subject: `New Collab Proposal from ${email}`,
        text: `You have a new message from your portfolio site:\n\nSender: ${email}\n\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email Error:", error);
            return res.status(500).json({ 
                status: "error", 
                message: "Failed to send email." 
            });
        }
        res.status(200).json({ 
            status: "success", 
            message: "Proposal sent successfully to Rohit!" 
        });
    });
});

app.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`PrinSanity Backend running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
    console.log(`-----------------------------------------------`);
});