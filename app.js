var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var firstPage = require('./routes/FirstPage');
var users = require('./routes/user');
var home = require('./routes/Home');
var app = express();
var session = require('client-sessions'); 
app.use(session({ cookieName: 'session', secret: 'cmpe273_test_string', duration: 30 * 60 * 1000, activeDuration: 5 * 60 * 1000 }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//Page Navigation
app.get('/',home.logIn);
app.get('/SignIn',home.logIn);
app.get('/HomePage', home.getHomePage);
app.get('/Profiles', home.getProfilesPage);
app.get('/About', home.getAboutPage);
app.get('/Friends', home.getFriends);
app.get('/Groups', home.getCreateGroupPage);
app.get('/logout', home.afterLogout);

//Login
app.post('/afterSignUp', home.afterSignUp);
app.post('/afterSignIn', home.afterSignIn);

//Posts
app.post('/afterPostClick', home.afterPostClick);
app.post('/afterGetPosts', home.afterGetPosts);
app.post('/afterGetMyPosts', home.afterGetMyPosts);

//User Details
app.post('/afterGetMe', home.afterGetMe);

//About and Interests
app.post('/afterSubmitAboutMe', home.afterSubmitAboutMe);
app.post('/afterGetAboutMe', home.afterGetAboutMe);

//Groups
app.post('/afterCreateGroupClick', home.afterCreateGroupClick);
app.post('/afterGetGroups', home.afterGetGroups);
app.post('/afterGetAllGroups', home.afterGetAllGroups);
app.post('/afterGetOtherGroups', home.afterGetOtherGroups);
app.post('/afterJoinGroup', home.afterJoinGroup);
app.post('/afterViewGroup', home.afterViewGroup);
app.post('/afterExitGroupClick', home.afterExitGroupClick);
app.post('/afterDeleteGroup', home.afterDeleteGroupClick);

//Friends
app.post('/afterSearchUsers', home.afterSearchUsers);
app.post('/afterGetMyFriends', home.afterGetMyFriends);
app.post('/afterGetAllFriends', home.afterGetAllFriends);
app.post('/getFriendRequests', home.getFriendRequests);
app.post('/afterUnfriend',home.unfriend );
app.post('/afterAddFriendClick', home.afterAddFriendClick);
app.post('/afterAcceptFriendRequest', home.afterAcceptFriendRequest);
app.post('/afterGetUserProfile', home.afterGetUserProfile);

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;