const pool = require("../pool");

const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries/categoryQueries");

async function getAllCats() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function getCatItem(id) {
    const category = await pool.query("SELECT * FROM categories WHERE CatId = $1", [id]);
    return category;
}

async function createCat(name, description) {
    await pool.query("INSERT INTO categories (CatName, CatDesc) VALUES ($1, $2)", [name, description])
}

async function getLatestCat() {
    const category = await pool.query("SELECT * FROM categories ORDER BY CatId DESC LIMIT 1");
    return category;
}

async function catUpdatePost(id, name, description) {
    await pool.query(
        "UPDATE categories SET CatName = $1, CatDesc = $2 WHERE CatId = $3",
        [name, description, id]
    );
}

async function catDeletePost(req, res) {
    await db.deleteCatItem(req.params.id)
    const categories = await db.getAllCats();
    res.render("categories", {categories});
}

async function deleteCatItem(id) {
    await pool.query("DELETE FROM categories WHERE CatId = $1", [id])
}






