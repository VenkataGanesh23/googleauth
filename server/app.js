const express = require("express");
const session = require("express-session");
const passport = require('passport');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');
const communication = require("./models/communication");
const app = express();
require('./googleaauthentication');
dotenv.config();
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin:"*",
    credential:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  communication.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect:"/profile"
  }),
  (req, res) => {
    res.redirect('/login');
  }
);

// Example protected route
app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.displayName}!`);
  } else {
    res.redirect('/login');
  }
});
app.get('/profile',(req,res)=>{
  res.redirect("http://localhost:5173/login")
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Replace with your Postmark API key
const POSTMARK_API_KEY = 'bab3d317-de4c-4ec7-a794-f77717ece3c6';
const POSTMARK_API_URL = 'https://api.postmarkapp.com';

// Endpoint to fetch communication details
app.get('/communication-details', async (req, res) => {
  try {
    // Example: Fetching sent emails using Postmark API
    const response = await axios.get(`${POSTMARK_API_URL}/messages/outbound`, {
      params: {
        count: 10 , // Adjust count as per your requirement
        offset:0
      },
      headers: {
        'X-Postmark-Server-Token': POSTMARK_API_KEY
      }
    });

    // Example: You can also fetch inbound messages or handle pagination if needed
    const communicationHistory = response.data;

    res.json(communicationHistory);
  } catch (error) {
    console.error('Error fetching communication details:', error);
    res.status(500).json({ error: 'Failed to fetch communication details' });
  }
});

// Endpoint to send an email
app.post('/send-email', async (req, res) => {
  try {
    // const { to, subject, textBody, htmlBody } = req.body;

    // Example: Sending email using Postmark API
    const response = await axios.post(`${POSTMARK_API_URL}/email`, {
      From: '197y1a05h6@mlritm.ac.in',
      To: '197y1a05h6@mlritm.ac.in',
      Subject: 'hi',
      TextBody: 'heelo',
      HtmlBody: 'htmlBody'
    }, {
      headers: {
        'X-Postmark-Server-Token': POSTMARK_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    // Example: Logging the sent email to a database or file
    console.log('Email sent:', response.data);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
