const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    // Match emails user
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, { message: 'Not User found.' });
    } else {
        // match password
        const match = await user.matchPassword(password);
        if (match) {
            // match activate
            const matchac = await User.findById(user._id);
            if (matchac.active == false) {
                return done(null, false, { message: 'verify your account' });
            } else {
                return done(null, user);
            }

        } else {
            return done(null, false, { message: 'Incorrect Password.' });
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});