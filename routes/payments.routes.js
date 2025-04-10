const { addNewPayment, findAllPayments, findByIdPayment, updatePayment, deletePayment } = require("../controllers/payments.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const clientGuard = require("../middleware/guards/client.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const owneradminGuard = require("../middleware/guards/owneradmin.guard");
const selfGuard = require("../middleware/guards/self.guard");


const router = require("express").Router();

router.post("/", adminGuard, addNewPayment);
router.get("/", adminGuard, findAllPayments);
router.get("/:id", owneradminGuard, selfGuard, findByIdPayment);
router.put("/:id", owneradminGuard, selfGuard, updatePayment);
router.delete("/:id", adminGuard, deletePayment);

module.exports = router;
