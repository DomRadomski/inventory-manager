const pool = require("../pool");

const { body, validationResult, matchedData } = require("express-validator");

async function getAllItems() {
    const { rows } = await pool.query("SELECT items.*, categories.catname FROM items JOIN categories ON items.itemcatid = categories.catid");
    return rows;
}

async function getInvItem(id) {
    const result = await pool.query("SELECT items.*, categories.catname FROM items JOIN categories ON items.itemcatid = categories.catid WHERE ItemId = $1", [id]);
    return result.rows[0];
}

async function createItem(name, description, price, stock, imageurl, catid) {
    await pool.query("INSERT INTO items (ItemName, ItemDesc, ItemPrice, ItemStock, ItemImageUrl, ItemCatId) VALUES ($1, $2, $3, $4, $5, $6)", [name, description, price, stock, imageurl, catid])
}

async function getLatestItem() {
    const result = await pool.query("SELECT * FROM items ORDER BY ItemId DESC LIMIT 1");
    return result.rows[0];
}

async function updateItem(id, name, description, price, stock, imageurl, catid) {
    await pool.query(
        "UPDATE items SET ItemName = $1, ItemDesc = $2, ItemPrice = $3, ItemStock = $4, ItemImageUrl = $5, ItemCatId = $6 WHERE ItemId = $7",
        [name, description, price, stock, imageurl, catid, id]
    );
}

async function deleteInvItem(id) {
    await pool.query("DELETE FROM items WHERE ItemId = $1", [id])
}

module.exports = {
    getAllItems,
    getInvItem,
    createItem,
    getLatestItem,
    updateItem,
    deleteInvItem  
}






