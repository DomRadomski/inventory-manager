// app.js
const path = require("node:path");
const express = require("express");

const catRouter = require("./routes/category")

const app = express();

// For CSS
// const assetsPath = path.join(__dirname, "public");
// app.use(express.static(assetsPath));

// Useful for parsing 
app.use(express.urlencoded({ extended: true }));

// View stuff
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to the homepage my driller")
});

app.use("/categories", catRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("errorPage", { error: "Something went wrong. Please try again." });
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});