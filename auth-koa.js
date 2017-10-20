const passport = require('koa-passport')

const fetchUser = (() => {
  // This is an example! Use password hashing in your
  const user = { id: 1, username: 'test', password: 'test' }
  return async function() {
    return user
  }
})()

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await fetchUser()
    done(null, user)
  } catch(err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  fetchUser()
    .then(user => {
      if (username === user.username && password === user.password) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
}))

const FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
    clientID: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
))

const TwitterStrategy = require('passport-twitter').Strategy
passport.use(new TwitterStrategy({
    consumerKey: 'your-consumer-key',
    consumerSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
))

const GoogleStrategy = require('passport-google-auth').Strategy
passport.use(new GoogleStrategy({
    clientId: 'your-client-id',
    clientSecret: 'your-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    fetchUser().then(user => done(null, user))
  }
))

var PasswordGrantStrategy = require('passport-oauth2-password-grant').Strategy;
passport.use(new PasswordGrantStrategy({
	tokenURL: 'http://localhost:3001/api/v1/oauth/token',
    clientID: 'democlient1',
    clientSecret: 'democlientsecret1',
    scope:'profile',
    grant_type: 'password',
    customHeaders: {"Authorization": "Basic ZGVtb2NsaWVudDE6ZGVtb2NsaWVudHNlY3JldDE=","scope":"profile"}
},
function(accessToken, refreshToken, profile, done) {
    console.log("Details ",accessToken,profile);
	done(null, profile);
}))
