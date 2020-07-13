var express = require('express');
var router = express.Router();
var users = require('../models/users');
var bodyParser = require('body-parser');
var passport = require('passport');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  users.register(new users({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else{
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          status: 'User registered successfully'
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    status: 'user logged in successfully'
  });
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
