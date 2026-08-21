const { Router } = require("express");
const invController = require("../controllers/inventoryController");
const invRouter = Router();
const asyncHandler = require("../utils/asyncHandler")

invRouter.get("/", asyncHandler(invController.invListGet));

invRouter.get("/item/:id", asyncHandler(invController.invItemGet));

invRouter.get("item/new", asyncHandler(invController.invCreateGet));
invRouter.get("item/new", asyncHandler(invController.invCreatePost));

invRouter.get("item/update/:id", asyncHandler(invController.invUpdateGet));
invRouter.post("item/update/:id", asyncHandler(invController.invUpdatePost));

invRouter.get("item/delete/:id", asyncHandler(invController.invDeleteGet));
invRouter.post("item/delete/:id", asyncHandler(invController.invDeletePost));

module.exports = invRouter;





