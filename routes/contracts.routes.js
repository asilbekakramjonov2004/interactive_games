const { addNewContract, findAllContracts, findByIdContract, updateContract, deleteContract } = require("../controllers/contracts.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const owneradminGuard = require("../middleware/guards/owneradmin.guard");


const router = require("express").Router();

router.post("/", adminGuard, addNewContract);
router.get("/", adminGuard, findAllContracts);
router.get("/:id", owneradminGuard, findByIdContract);
router.put("/:id", adminGuard, updateContract);
router.delete("/:id", adminGuard, deleteContract);

module.exports = router;
