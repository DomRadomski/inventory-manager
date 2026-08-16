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

catRouter.get("/delete/:id", asyncHandler(catController.catDeleteGet));
catRouter.post("/delete/:id", asyncHandler(catController.catDeletePost));

module.exports = catRouter;