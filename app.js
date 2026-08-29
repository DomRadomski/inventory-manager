// Node module imports
const path = require("node:path");
const express = require("express");
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
require("dotenv").config()

// Db imports
const pool = require('./db/pool')

// Util imports
const renderError = require("./utils/renderError");
require("./utils/auth/passport")

// Route imports
const authRouter = require("./routes/auth")
const catRouter = require("./routes/category")
const invRouter = require("./routes/inventory")

// App setup
const app = express();

// For CSS
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Useful for parsing 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// View stuff
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup

const pgSession = require("connect-pg-simple")(session);

const sessionStore = new pgSession({
    pool: pool,
    tableName: "session",
});

app.use(session({
    store: sessionStore,
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Passport authentication

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// Routes

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/auth", authRouter);
app.use("/categories", catRouter);
app.use("/inventory/items", invRouter);

app.use("/", (req, res) => {
    renderError(req, res, "Page not found", 404);
});

app.use((err, req, res, next) => {
    console.error(err);
    renderError(req, res, "Something went wrong. Please try again.", 500);
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});