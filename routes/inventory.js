const { Router } = require("express");
const { body } = require("express-validator");
const invController = require("../controllers/inventoryController");
const invRouter = Router();
const asyncHandler = require("../utils/asyncHandler")

invRouter.get("/", asyncHandler(invController.invListGet));

invRouter.get("/item/:id", asyncHandler(invController.invItemGet));

invRouter.get("/new", asyncHandler(invController.invCreateGet));
invRouter.post("/new",
    body("name").trim().notEmpty().withMessage("Item name is required"),
    body("description").trim().optional({ values: "falsy" }),
    body("price")
        .notEmpty().withMessage("Price is required")
        .bail()
        .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock")
        .notEmpty().withMessage("Stock is required")
        .bail()
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative whole number"),
    body("catid").optional({ values: "falsy" }).isInt().withMessage("Invalid category"),
    asyncHandler(invController.invCreatePost)
);

invRouter.get("/item/update/:id", asyncHandler(invController.invUpdateGet));
invRouter.post("/item/update/:id",
    body("name").trim().notEmpty().withMessage("Item name is required"),
    body("description").trim().optional({ values: "falsy" }),
    body("price")
        .notEmpty().withMessage("Price is required")
        .bail()
        .isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock")
        .notEmpty().withMessage("Stock is required")
        .bail()
        .isInt({ min: 0 }).withMessage("Stock must be a non-negative whole number"),
    body("catid").optional({ values: "falsy" }).isInt().withMessage("Invalid category"),
    asyncHandler(invController.invUpdatePost)
);

invRouter.get("/item/delete/:id", asyncHandler(invController.invDeleteGet));
invRouter.post("/item/delete/:id", asyncHandler(invController.invDeletePost));

module.exports = invRouter;





