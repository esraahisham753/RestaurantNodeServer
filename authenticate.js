var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');
var passportFacebookStrategy = require('passport-facebook-token');
const { use } = require('passport');

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

var opt = {};
opt.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = config.secretKey;

exports.jwt = passport.use(new jwtStrategy(opt, (jwt_payload, done) => {
    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err){
            return done(err, false);
        }
        else if(user){
            return done(null, user);
        }
        else{
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', {
    session: false
});

exports.facebookPassport = passport.use(new passportFacebookStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if(err){
            return done(err, false);
        }
        else if(user != null){
            return done(null, user)
        }
        else{
            var user = new User({facebookId: profile.id});
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.username = profile.displayName;
            user.save((err, user) => {
                if(err){
                    return done(err, false);
                } 
                else{
                    return done(null, user)
                }
            });
        }
    });
}));

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    }
    else{
        var err = new Error("You are not authenticated to perform this operation");
        err.status = 403;
        return next(err);
    }
}