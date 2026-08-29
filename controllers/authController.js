const passport = require("passport");
const { validationResult, matchedData } = require("express-validator");
const User = require("../db/user");
const { genPassword, validPassword } = require("../utils/auth/password");

async function authLoginGet(req, res) {
    const messages = req.session.messages || [];
    req.session.messages = [];
    res.render("auth/login", { messages });
}

function authLoginPost(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = [info?.message || "Invalid username or password"];
            return res.redirect("/auth/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
}

async function authLogoutPost(req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}

async function authRegisterGet(req, res) {
    res.render("auth/register");
}

async function authRegisterPost(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("auth/register", { errors: errors.array() });
    }

    const { username } = matchedData(req);
    const password = req.body.password;

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
        return res.render("auth/register", {
            errors: [{ msg: "That username is already taken" }]
        });
    }

    const { salt, hash } = genPassword(password);
    const user = await User.create(username, hash, salt);

    req.logIn(user, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}


module.exports = {
    authLoginGet,
    authLoginPost,
    authLogoutPost,
    authRegisterGet,
    authRegisterPost
};