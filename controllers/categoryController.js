const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries/categoryQueries");

async function catListGet(req, res) {
    const categories = await db.getAllCats();
    res.render("categories", {categories});
}

async function catItemGet(req, res) {
    const category = await db.getCatItem(req.params.id);
    res.render("category", {category});
}

async function catCreateGet(req, res) {
    res.render("createCategory");
}

async function catCreatePost(req, res) {
    const { name, description } = req.body;
    await db.createCat(name, description);
    const category = await db.getLatestCat();
    res.render("category", {category});
}

async function catUpdateGet(req, res) {
    const category = await db.getCatItem(req.params.id);
    res.render("updateCategory", {category})
}

async function catUpdatePost(req, res) {
    const id = req.params.id;
    const { name, description } = req.body;
    await db.updateCat(id, name, description);
    const category = await db.getCatItem(id);
    res.render("category", {category});
}

async function catDeleteGet(req, res) {
    const category = await db.getCatItem(req.params.id);
    res.render("deleteCategory", {category})
}

async function catDeletePost(req, res) {
    await db.deleteCatItem(req.params.id)
    const categories = await db.getAllCats();
    res.render("categories", {categories});
}

module.exports = {
    catListGet,
    catItemGet,
    catCreateGet,
    catCreatePost,
    catUpdateGet,
    catUpdatePost,
    catDeleteGet,
    catDeletePost
}





