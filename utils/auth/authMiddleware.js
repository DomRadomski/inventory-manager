function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}

function isAdmin(req, res, next) {
    // TODO: check req.user's admin status once that concept exists
    return next();
}

module.exports = {
    isAuthenticated,
    isAdmin
};