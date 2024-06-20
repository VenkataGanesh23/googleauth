const express = require("express");
const session = require("express-session");
const passport = require('passport');
const dotenv = require("dotenv");
const communication = require("./models/communication");
const app = express();

var GoogleStrategy = require('passport-google-oauth2').Strategy;

app.use(session({
  secret: "Mysecret!!",
  resave: false,  
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: "315730902359-cg9trg1otq4scb8b79ek1qh24sqt2jan.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3001/auth/google/callback", // Updated port
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      let user = await communication.findOne({ googleId: profile.id });
      if (!user) {
        user = new communication({
          googleId: profile.id,
          body: 'Default body', // Replace with actual values as needed
          subject: 'Default subject', // Replace with actual values as needed
          to: 'Default to' // Replace with actual values as needed
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));




// Define the route for Google authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Define the callback route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home or wherever you need.
    res.redirect('/');
  }
);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
