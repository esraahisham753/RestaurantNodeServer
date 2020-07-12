var express = require('express');
var router = express.Router();
var users = require('../models/users');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  //console.log('users post');
  users.findOne({username: req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error('User ' + req.body.username + ' is already existed');
      err.status = 403;
      return next(err);
    }
    else{
      return users.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      status: "Regestration Successful!",
      user: user
    });
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if(!req.session.user){
    var authHeader = req.headers.authorization;
    if(!authHeader){
      var err = new Error('You are not authenticated!');
      err.status = 401;
      res.setHeader('WWW-Authenticate', 'Basic');
      return next(err);
    }
    else{
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
      users.findOne({username: username})
      .then((user) => {
        if(user == null){
          var err = new Error('User ' + username + ' does not exist');
          err.status = 401;
          return next(err);
        }
        else if(user.password != password){
          var err = new Error('The password is not correct');
          err.status = 401;
          return next(err);
        }
        else if(user.username == username && user.password == password){
          req.session.user = "Authenticated";
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.end('You are authenticated!');
        }
      }, (err) => next(err))
      .catch((err) => next(err));
    }
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session.user){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('Cannot perform logout for un logged in user');
    err.status = 403;
    return next(err);
  }
});

module.exports = router;
