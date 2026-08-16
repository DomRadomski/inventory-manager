const pool = require("../pool");

const { body, validationResult, matchedData } = require("express-validator");

async function getAllCats() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function getCatItem(id) {
    const result = await pool.query("SELECT * FROM categories WHERE CatId = $1", [id]);
    return result.rows[0];
}

async function createCat(name, description) {
    await pool.query("INSERT INTO categories (CatName, CatDesc) VALUES ($1, $2)", [name, description])
}

async function getLatestCat() {
    const result = await pool.query("SELECT * FROM categories ORDER BY CatId DESC LIMIT 1");
    return result.rows[0];
}

async function updateCat(id, name, description) {
    await pool.query(
        "UPDATE categories SET CatName = $1, CatDesc = $2 WHERE CatId = $3",
        [name, description, id]
    );
}

async function deleteCatItem(id) {
    await pool.query("DELETE FROM categories WHERE CatId = $1", [id])
}

module.exports = {
    getAllCats,
    getCatItem,
    createCat,
    getLatestCat,
    updateCat
    
}






