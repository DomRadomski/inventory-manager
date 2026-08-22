// app.js
const path = require("node:path");
const express = require("express");
const renderError = require("./utils/renderError");

const catRouter = require("./routes/category")
const invRouter = require("./routes/inventory")

const app = express();

// For CSS
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// Useful for parsing 
app.use(express.urlencoded({ extended: true }));

// View stuff
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to the homepage my driller")
});

app.use("/categories", catRouter);
app.use("/inventory/items", invRouter);

app.use((err, req, res, next) => {
    console.error(err);
    renderError(req, res, "Something went wrong. Please try again.", 500);
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});