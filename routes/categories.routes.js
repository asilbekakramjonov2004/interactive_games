const { addNewCategory, findAllCategories, findByIdCategory, updateCategory, deleteCategory } = require("../controllers/categories.controller");
const adminGuard = require("../middleware/guards/admin.guard");



const router = require("express").Router();

router.post("/", adminGuard, addNewCategory);
router.get("/", adminGuard, findAllCategories);
router.get("/:id", adminGuard, findByIdCategory);
router.put("/:id", adminGuard, updateCategory);
router.delete("/:id", adminGuard, deleteCategory);

module.exports = router;
