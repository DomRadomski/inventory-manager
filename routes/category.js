const { Router } = require("express");
const catController = require("../controllers/categoryController");
const catRouter = Router();

catRouter.get("/", catController.catListGet);

catRouter.get("/:id", catController.catItemGet);

catRouter.get("/new", catController.catCreateGet);
catRouter.get("/new", catController.catCreatePost);

catRouter.get("/update/:id", catController.catUpdateGet)
catRouter.post("/update/:id", catController.catUpdatePost)

catRouter.get("/delete/:id", catController.catDeleteGet)
catRouter.post("/delete/:id", catController.catDeletePost)

module.exports = catRouter;




