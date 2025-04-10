const { addNewOwner, findAllOwners, findByIdOwner, updateOwner, deleteOwner, loginOwner, activateOwnersAccount, logoutOwner, refreshTokenOwner } = require("../controllers/owners.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const ownerGuard = require("../middleware/guards/owner.guard");
const owneradminGuard = require("../middleware/guards/owneradmin.guard");
const selfGuard = require("../middleware/guards/self.guard");


const router = require("express").Router();

router.post("/", addNewOwner);
router.post("/login", loginOwner);
router.get("/", adminGuard, findAllOwners);
router.get("/activate/:link", activateOwnersAccount);
router.get("/logout", logoutOwner);
router.get("/refreshtoken", refreshTokenOwner);
router.get("/:id", owneradminGuard, selfGuard, findByIdOwner);
router.put("/:id", owneradminGuard, selfGuard, updateOwner);
router.delete("/:id", owneradminGuard, selfGuard, deleteOwner);

module.exports = router;
