function renderError(req, res, message, status) {
    const back = req.get("Referer") || "/";
    res.status(status).render("errorPage", { error: message, back, status });
}

module.exports = renderError;