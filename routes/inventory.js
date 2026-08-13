const { Router } = require("express");
const invController = require("../controllers/inventoryController");
const invRouter = Router();

invRouter.get("/items", invController.invListGet);

invRouter.get("item/:id", invController.invItemGet);

invRouter.get("/new", invController.invCreateGet);
invRouter.get("/new", invController.invCreatePost);

invRouter.get("/update/:id", invController.invUpdateGet)
invRouter.post("/update/:id", invController.invUpdatePost)

invRouter.get("/delete/:id", invController.invDeleteGet)
invRouter.post("/delete/:id", invController.invDeletePost)

module.exports = invRouter;




