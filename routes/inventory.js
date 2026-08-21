const { Router } = require("express");
const invController = require("../controllers/inventoryController");
const invRouter = Router();

invRouter.get("/", asyncHandler(invController.invListGet));

invRouter.get("/item/:id", asyncHandler(invController.invItemGet));

invRouter.get("item/new", asyncHandler(invController.invCreateGet));
invRouter.get("item/new", asyncHandler(invController.invCreatePost));

invRouter.get("item/update/:id", asyncHandler(invController.invUpdateGet));
invRouter.post("item/update/:id", asyncHandler(invController.invUpdatePost));

invRouter.get("item/delete/:id", asyncHandler(invController.invDeleteGet));
invRouter.post("item/delete/:id", asyncHandler(invController.invDeletePost));

module.exports = invRouter;

const { Router } = require("express");
const { body } = require("express-validator");
const catController = require("../controllers/categoryController");
const asyncHandler = require("../utils/asyncHandler");
const catRouter = Router();

catRouter.get("/", asyncHandler(catController.catListGet));

catRouter.get("/:id", asyncHandler(catController.catItemGet));

catRouter.get("/category/new", asyncHandler(catController.catCreateGet));

catRouter.post("/category/new",
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catCreatePost)
);

catRouter.get("/category/update/:id", asyncHandler(catController.catUpdateGet));

catRouter.post("/category/update/:id",
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catUpdatePost)
);

catRouter.get("/category/delete/:id", asyncHandler(catController.catDeleteGet));
catRouter.post("/category/delete/:id", asyncHandler(catController.catDeletePost));

module.exports = catRouter;




