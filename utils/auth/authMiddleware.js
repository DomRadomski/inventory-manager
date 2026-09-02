const { renderError } = require("../../utils/renderError");

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.useradmin) {
        return next();
    }
    renderError(req, res, "You don't have permission to do that", 403)
}

module.exports = {
    isAuthenticated,
    isAdmin
};