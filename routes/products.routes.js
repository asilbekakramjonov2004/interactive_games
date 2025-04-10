const { addNewProduct, findAllProducts, findByIdProduct, updateProduct, deleteProduct } = require("../controllers/products.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const owneradminGuard = require("../middleware/guards/owneradmin.guard");
const selfGuard = require("../middleware/guards/self.guard");


const router = require("express").Router();

router.post("/", owneradminGuard, addNewProduct);
router.get("/", adminGuard, findAllProducts);
router.get("/:id", owneradminGuard, selfGuard, findByIdProduct);
router.put("/:id", owneradminGuard, selfGuard, updateProduct);
router.delete("/:id", adminGuard, deleteProduct);


module.exports = router;
