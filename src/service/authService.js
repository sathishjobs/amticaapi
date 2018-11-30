let passport = require('passport');
let LocalStrategy = require('passport-local');
let {Strategy, ExtractJwt} = require('passport-jwt');

let User = require("../userModule/user.model");
let constants = require("../config/constants");

// jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: constants.JWTSecret,
};

const jwtStrategy = new Strategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload._id);  
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(jwtStrategy);

module.exports.authJwt = passport.authenticate('jwt', { session: false });
