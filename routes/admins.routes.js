const { addNewAdmin, findAllAdmins, findByIdAdmin, updateAdmin, deleteAdmin, logoutAdmin, loginAdmin, refreshTokenAdmin } = require("../controllers/admins.controller");
const adminGuard = require("../middleware/guards/admin.guard")
const selfGuarg = require("../middleware/guards/self.guard")
const checkAdminGuard = require("../middleware/guards/check.admin.guard")

const router = require("express").Router();



router.post("/", addNewAdmin);
router.post("/login", loginAdmin);
router.get("/", adminGuard, checkAdminGuard, findAllAdmins);
router.get("/logout", logoutAdmin);
router.get("/refreshtoken", refreshTokenAdmin);
router.get("/:id", adminGuard, selfGuarg, findByIdAdmin);
router.put("/:id", adminGuard, selfGuarg, updateAdmin);
router.delete("/:id", adminGuard, selfGuarg, deleteAdmin);

module.exports = router;
