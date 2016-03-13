var express = require('express');
var bodyParser = require('body-parser');

var passport = require('passport');
var strategy = require('./auth/setup-passport')
var cookieParser = require('cookie-parser');
var session = require('express-session');


var path = require('path');  

var postHelper = require('./helpers/posts');

var app = express();
var PORT = 3000;

app.use(cookieParser());
app.use(session({                       // Used to track user session
        secret: "ASECRETCODEGOESHERE",
        resave: true,
        saveUninitialized: true
    }));

app.set('view engine', 'ejs');

passport.use(strategy); 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: false })); // setting for body parser
app.use(bodyParser.json());


postHelper.initESIndex(); 



//Routes
/*app.get('/', function(req, res) {
    //if (!req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, 'views/signin.html'));
        //res.sendFile(path.join(__dirname, 'views/index.html'));
    //}
    //else {
    //    res.redirect('/main');
    //}
});*/

app.get('/', function(req, res){
   // if (!req.isAuthenticated()) {
    //    res.redirect('/');
    //}else{
        var signedIn = true;
        if (!req.isAuthenticated()) {
            signedIn = false;
        }
        
        postHelper.getRecentPosts(function(err, posts){

            if(err) console.log(err);
            res.render(path.join(__dirname, 'views/main.ejs'), 
            {  posts: posts,
               signedIn : signedIn
             }
            );
        });
    //}
});

app.post('/newpost', function(req, res){
    console.log(req);
    if (!req.isAuthenticated())
        res.status(403)
    else {
        var post = postHelper.createPost(req);
        var status = postHelper.savePost(post);
        res.status(status);
    }
});

app.get('/makepost', function(req, res){
    var signedIn = true;
    if(!req.isAuthenticated()){
        signedIn = false;
    }
        
    res.render(path.join(__dirname, 'views/create.ejs'),
    {
        signedIn : signedIn
    });
    
});

// route handler for our auth callback
app.get('/callback',
    passport.authenticate('auth0', {failureRedirect: '/failure'}),
    function(req, res) {
        // If user isn't present throw error, else they're authed so send to feed
        if (!req.user)
            throw new Error('user null');
        else{
            postHelper.getRecentPosts(function(err, posts){

            if(err) console.log(err);
            res.render(path.join(__dirname, 'views/main.ejs'), 
            {  posts: posts,
               signedIn : true
                }
            );
        });
        }
    });
    
    // route to handle when logins go wrong
app.get('/failure', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/failure.html'));
});
   

app.listen(PORT, function() {
    console.log('Listening on port', PORT);
})