const { addNewStatus, findAllStatus, findByIdStatus, updateStatus, deleteStatus } = require("../controllers/status.controller");
const adminGuard = require("../middleware/guards/admin.guard");


const router = require("express").Router();

router.post("/", adminGuard, addNewStatus);
router.get("/", adminGuard, findAllStatus);
router.get("/:id", adminGuard, findByIdStatus);
router.put("/:id", adminGuard, updateStatus);
router.delete("/:id", adminGuard, deleteStatus);

module.exports = router;
