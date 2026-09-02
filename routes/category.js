const { Router } = require("express");
const { body } = require("express-validator");
const { isAdmin } = require("../utils/auth/authMiddleware");
const catController = require("../controllers/categoryController");
const asyncHandler = require("../utils/asyncHandler");
const catRouter = Router();

catRouter.get("/", asyncHandler(catController.catListGet));
catRouter.get("/category/:id", asyncHandler(catController.catItemGet));

catRouter.get("/new", asyncHandler(catController.catCreateGet));
catRouter.post("/new",
    isAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catCreatePost)
);


catRouter.get("/category/update/:id", asyncHandler(catController.catUpdateGet));
catRouter.post("/category/update/:id",
    isAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catUpdatePost)
);

catRouter.get("/category/delete/:id", asyncHandler(catController.catDeleteGet));
catRouter.post("/category/delete/:id", isAdmin, asyncHandler(catController.catDeletePost));

module.exports = catRouter;