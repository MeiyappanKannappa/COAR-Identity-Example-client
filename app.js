const express = require('express')
const app = express()
const OAuth2Strategy=require('passport-oauth2')
var passport = require('passport');
var http = require('http');
var https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var client = new OAuth2Strategy({
    authorizationURL: 'https://localhost/login?clientId=TcMKABHMZw41&scope=karthik&redirectUri=http://localhost:8080/auth/example/callback',
    tokenURL: 'https://localhost/api/v1/oauth/token',
    clientID: 'TcMKABHMZw41',
    clientSecret: 'P442FaYRGWsNU4M41lo0y2MR',
    callbackURL: "http://localhost:8080/auth/example/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log("Inside access token ",profile);
    
      return cb(null,profile);
    
  }
);
client.userProfile = function (accesstoken, done) {
    // choose your own adventure, or use the Strategy's oauth client
    var options = {
        host: 'localhost',
        port: '443',
        path: '/api/v1/profile',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accesstoken,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    //console.log(ctx.response);

    var req = https.request(options, function (res) {
        var msg = '';

        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            msg += chunk;
        });
        res.on('end', function () {
            console.log(JSON.parse(msg));
            var coderesdata = JSON.parse(msg);
            done(null, coderesdata);
           
        });
    });
    //req.write();
    req.end();
    
  };
  passport.serializeUser(function(user, done) {
    done(null, user._id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  
    done(err, user);
  
});
passport.use(client);


app.use(passport.initialize());
app.use(passport.session());

//Authentication tested for this URL
app.get('/auth/example',
passport.authenticate('oauth2'));

app.get('/auth/example/callback',
passport.authenticate('oauth2', { failureRedirect: '/login',session: false }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})