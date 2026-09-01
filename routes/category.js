const { Router } = require("express");
const { body } = require("express-validator");
const { isAuthenticated, isAdmin } = require("../utils/auth/authMiddleware");
const catController = require("../controllers/categoryController");
const asyncHandler = require("../utils/asyncHandler");
const catRouter = Router();

catRouter.get("/", asyncHandler(catController.catListGet));
catRouter.get("/:id", asyncHandler(catController.catItemGet));

catRouter.get("/category/new", isAdmin, asyncHandler(catController.catCreateGet));
catRouter.post("/category/new",
    isAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catCreatePost)
);

catRouter.get("/category/update/:id", isAdmin, asyncHandler(catController.catUpdateGet));
catRouter.post("/category/update/:id",
    isAdmin,
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("description").trim().optional({ values: "falsy" }),
    asyncHandler(catController.catUpdatePost)
);

catRouter.get("/category/delete/:id", isAdmin, asyncHandler(catController.catDeleteGet));
catRouter.post("/category/delete/:id", isAdmin, asyncHandler(catController.catDeletePost));

module.exports = catRouter;