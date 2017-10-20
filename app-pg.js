const express = require('express')
const app = express()
var passport = require('passport');
var http = require('http');

var PasswordGrantStrategy = require('passport-oauth2-password-grant');


var passportstrategy=new PasswordGrantStrategy({
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
})
passportstrategy.userProfile=function(accessToken, done){
    console.log("User pfoile inside");
    var options = {
        host: 'localhost',
        port: 3001,
        path: '/profile',
        method: 'GET',
        headers: {'Authorization': 'Bearer '+accessToken}
      };
      
      http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
          done(null,chunk);
        });
      }).end();
}
passport.use(passportstrategy);

function authenticate() {
	return function(req, res, next) {
		//var username = req.body.username;
		//var password = req.body.password;

		passport.authenticate('password-grant', {
			username: 'barryyomamura',
            password: 'barryyomamurapw',
            scope: 'profile'
		}, function(err, user, info) {
            console.log("Inside methid");
            if (err) { return next(err); }
            if (!user) { return res.redirect('/'); }
        
            // req / res held in closure
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.send(user);
            });
        
          })(req, res, next);
	};
}
passport.serializeUser(function(user, done) {
    console.log("Serialize User",user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log("DE Serialize User");
    done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/handler', authenticate({session:false}), function(req, res) {
	res.redirect('/');
});








app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})