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

const POSTMARK_API_KEY = 'bab3d317-de4c-4ec7-a794-f77717ece3c6';
const POSTMARK_API_URL = 'https://api.postmarkapp.com';

app.get('/communication-details', async (req, res) => {
  try {
    // Parameters for listing recent outbound messages
    const listUrl = `${POSTMARK_API_URL}/messages/outbound`;
    const params = {
      count: 10, 
      offset: 0,  
    };

    const headers = {
      'Accept': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_API_KEY,
    };

    // Fetch list of recent outbound messages
    const response = await axios.get(listUrl, { params, headers });

    if (response.status === 200) {
      try {
        if (Array.isArray(response.data)) {
          const messageIds = response.data.map(message => message.MessageID);
          const emailsDetailsPromises = messageIds.map(async messageId => {
            if (!messageId) {
              throw new Error('Invalid messageId encountered');
            }
            const detailsUrl = `${POSTMARK_API_URL}/messages/outbound/${messageId}/details`;
            const detailsResponse = await axios.get(detailsUrl, { headers });
            
            return detailsResponse.data;
          });
          
          const emailsDetails = await Promise.all(emailsDetailsPromises);
          res.status(200).json(emailsDetails);
        } else {
          const messagesArray = Object.keys(response.data).map(key => ({ [key]: response.data[key] }));

          console.log(response.data, 'response data')
          console.log(messagesArray, 'messagesArray')
          
          const messageIds = messagesArray[1].Messages.map(message => message.MessageID).filter(String);


          console.log(messageIds, 'messageIds')
          
          const validMessageIds = messageIds.filter(messageId => !!messageId);
  
  if (validMessageIds.length === 0) {
    throw new Error('No valid messageIds found');
  }
          
          const emailsDetailsPromises = validMessageIds.map(async messageId => {
            if (!messageId) {
              throw new Error('Invalid messageId encountered');
            }
            const detailsUrl = `${POSTMARK_API_URL}/messages/outbound/${messageId}/details`;
            const detailsResponse = await axios.get(detailsUrl, { headers });
            
            return detailsResponse.data;
          });
          
      
          const emailsDetails = await Promise.all(emailsDetailsPromises);
          res.status(200).json(emailsDetails);
        }
        
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
      }
      
    } else {
      console.error('Error fetching outbound messages:', response.status, response.statusText);
      res.status(response.status).send('Error fetching outbound messages');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject,body } = req.body;
    console.log(to,subject,body)
    const response = await axios.post(`${POSTMARK_API_URL}/email`, {
      From: '197y1a05h6@mlritm.ac.in',
      To: to,
      Subject: subject,
      TextBody: body, 
    }, {
      headers: {
        'X-Postmark-Server-Token': POSTMARK_API_KEY,
        'Accept': 'application/json',
    'Content-Type': 'application/json',
      }
    });

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
