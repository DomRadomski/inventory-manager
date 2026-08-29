const { Router } = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const asyncHandler = require("../utils/asyncHandler");

const authRouter = Router();

authRouter.get("/login", asyncHandler(authController.authLoginGet));
authRouter.post("/login", asyncHandler(authController.authLoginPost));
authRouter.post("/logout", asyncHandler(authController.authLogoutPost));

authRouter.get("/register", asyncHandler(authController.authRegisterGet));
authRouter.post("/register",
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("confirmPassword")
        .notEmpty().withMessage("Please confirm your password")
        .bail()
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
    asyncHandler(authController.authRegisterPost)
);

module.exports = authRouter;