const { validationResult, matchedData } = require("express-validator");
const db = require("../db/queries/inventoryQueries");
const db2 = require("../db/queries/categoryQueries");


async function invListGet(req, res) {
    const items = await db.getAllItems();
    if (!items) {
        return res.render("errorPage", { error: "Unable to load items" });
    }
    res.render("inventory/items", { items });
}

async function invItemGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid request" });
    }
    const item = await db.getInvItem(id);
    console.log(item)
    if (!item) {
        return res.render("errorPage", { error: "Item not found" });
    }
    res.render("inventory/item", { item });
}

async function invCreateGet(req, res) {
    const item = await db.getLatestItem();
    const categories = await db2.getAllCats();
    console.log(item)
    res.render("inventory/createItem", { categories });
}

async function invCreatePost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render("category/createCategory", { errors: errors.array() });
    }

    const { name, description, price, stock, imageurl=null, catid } = matchedData(req);
    await db.createItem(name, description || null, price, stock, imageurl || null, catid || null);
    const item = await db.getLatestItem();
    res.redirect(`inventory/items/item/${item.itemid}`);
}

async function invUpdateGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid request" });
    }

    const item = await db.getInvItem(id);
    const categories = await db2.getAllCats();

    if (!item) {
        return res.render("errorPage", { error: "Item not found" });
    }

    res.render("inventory/updateItem", { item, categories });
}

async function invUpdatePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid request" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const category = await db.getInvItem(id);
        return res.render("inventory/updateItem", { item, errors: errors.array() });
    }

    const { name, description, price, stock, imageurl=null, catid } = matchedData(req);
    await db.updateItem(id, name, description || null, price, stock, imageurl || null, catid || null);
    res.redirect(`/inventory/items/item/${id}`);
}

async function invDeleteGet(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid request" });
    }

    const item = await db.getInvItem(id);
    if (!item) {
        return res.render("errorPage", { error: "Item not found" });
    }
    res.render("inventory/deleteItem", { item });
}

async function invDeletePost(req, res) {
    const id = req.params.id;
    if (!isValidId(id)) {
        return res.render("errorPage", { error: "Invalid request" });
    }

    await db.deleteInvItem(id);
    const items = await db.getAllItems();
    if (!items) {
        return res.render("errorPage", { error: "Unable to load items" });
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