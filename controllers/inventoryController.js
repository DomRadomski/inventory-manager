const { validationResult, matchedData } = require("express-validator");
const db = require("../db/queries/inventoryQueries");
const db2 = require("../db/queries/categoryQueries");
const renderError = require("../utils/renderError");

async function invListGet(req, res) {
    const items = await db.getAllItems();
    if (!items) {
        return renderError(req, res, "Unable to load items", 500);
    }
    res.render("inventory/items", { items });
}

async function invItemGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return renderError(req, res, "Invalid item id", 400);
    }
    const item = await db.getInvItem(id);
    if (!item) {
        return renderError(req, res, "Item not found", 404);
    }
    res.render("inventory/item", { item });
}

async function invCreateGet(req, res) {
    const categories = await db2.getAllCats();
    res.render("inventory/createItem", { categories });
}

async function invCreatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await db2.getAllCats();
        return res.render("inventory/createItem", { categories, errors: errors.array() });
    }

    const { name, description, price, stock, imageurl, catid } = matchedData(req);
    await db.createItem(name, description || null, price, stock, imageurl || null, catid || null);
    const item = await db.getLatestItem();
    res.redirect(`/inventory/items/item/${item.itemid}`);
}

async function invUpdateGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return renderError(req, res, "Invalid item id", 400);
    }

    const item = await db.getInvItem(id);
    const categories = await db2.getAllCats();

    if (!item) {
        return renderError(req, res, "Item not found", 404);
    }

    res.render("inventory/updateItem", { item, categories });
}

async function invUpdatePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return renderError(req, res, "Invalid item id", 400);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const item = await db.getInvItem(id);
        const categories = await db2.getAllCats();
        return res.render("inventory/updateItem", { item, categories, errors: errors.array() });
    }

    const { name, description, price, stock, imageurl, catid } = matchedData(req);
    await db.updateItem(id, name, description || null, price, stock, imageurl || null, catid || null);
    res.redirect(`/inventory/items/item/${id}`);
}

async function invDeleteGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return renderError(req, res, "Invalid item id", 400);
    }

    const item = await db.getInvItem(id);
    if (!item) {
        return renderError(req, res, "Item not found", 404);
    }
    res.render("inventory/deleteItem", { item });
}

async function invDeletePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return renderError(req, res, "Invalid item id", 400);
    }

    await db.deleteInvItem(id);
    const items = await db.getAllItems();
    if (!items) {
        return renderError(req, res, "Unable to load items", 500);
    }

    res.render("inventory/items", { items });
}

function isValidId(id) {
    return /^\d+$/.test(id);
}

module.exports = {
    invListGet,
    invItemGet,
    invCreateGet,
    invCreatePost,
    invUpdateGet,
    invUpdatePost,
    invDeleteGet,
    invDeletePost
}