const JwtStratergy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');

const keys = require('../config/keys');

// Make an objext with empty options
const opts = {};

// Modifying the options now
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrPrivateKey;

module.exports = passport =>  {
    passport.use(new JwtStratergy(opts, (jwt_payload,done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if(user)
                {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }
    ));
};