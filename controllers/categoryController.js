const { validationResult, matchedData } = require("express-validator");
const db = require("../db/queries/categoryQueries");

async function catListGet(req, res) {
    const categories = await db.getAllCats();
    if (!categories) {
        return res.render("errorPage", { error: "Unable to load categories" });
    }
    res.render("category/categories", { categories });
}

async function catItemGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid category id" });
    }
    const category = await db.getCatItem(id);
    console.log(category)
    if (!category) {
        return res.render("errorPage", { error: "Category not found" });
    }
    res.render("category/category", { category });
}

async function catCreateGet(req, res) {
    const category = await db.getLatestCat();
    console.log(category)
    res.render("category/createCategory");
}

async function catCreatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("category/createCategory", { errors: errors.array() });
    }

    const { name, description } = matchedData(req);
    await db.createCat(name, description || null);
    const category = await db.getLatestCat();
    res.redirect(`/categories/${category.catid}`);
}

async function catUpdateGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid category id" });
    }

    const category = await db.getCatItem(id);
    if (!category) {
        return res.render("errorPage", { error: "Category not found" });
    }

    res.render("category/updateCategory", { category });
}

async function catUpdatePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid category id" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const category = await db.getCatItem(id);
        return res.render("category/updateCategory", { category, errors: errors.array() });
    }

    const { name, description } = matchedData(req);
    await db.updateCat(id, name, description || null);
    res.redirect(`/categories/${id}`);
}

async function catDeleteGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid category id" });
    }

    const category = await db.getCatItem(id);
    if (!category) {
        return res.render("errorPage", { error: "Category not found" });
    }
    res.render("category/deleteCategory", { category });
}

async function catDeletePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid category id" });
    }

    await db.deleteCatItem(id);
    const categories = await db.getAllCats();
    if (!categories) {
        return res.render("errorPage", { error: "Unable to load categories" });
    }

    res.render("category/categories", { categories });
}

function isValidId(id) {
    return /^\d+$/.test(id);
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