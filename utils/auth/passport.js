const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../db/user");
const { validPassword } = require("./password");

const customFields = {
    usernameField: "username",
    passwordField: "password"
};

const verifyCallback = (username, password, done) => {
    User.findByUsername(username)
        .then((user) => {
            if (!user) {
                return done(null, false);
            }

            const isValid = validPassword(password, user.userhash, user.usersalt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.userid);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => done(err));
});