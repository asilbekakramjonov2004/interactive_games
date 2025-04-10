const { addNewClient, findAllClients, findByIdClient, updateClient, deleteClient, loginClient, activateClientAccount, refreshClientToken, logoutClient } = require("../controllers/clients.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const clientGuard = require("../middleware/guards/client.guard");
const clientadminGuard = require("../middleware/guards/clientadmin.guard");
const selfGuard = require("../middleware/guards/self.guard");


const router = require("express").Router();

router.post("/", clientGuard, addNewClient);
router.post("/login", loginClient);
router.get("/", adminGuard, findAllClients);
router.get("/activate/:link", activateClientAccount);
router.get("/logout", logoutClient);
router.get("/refreshtoken", refreshClientToken);
router.get("/:id",clientadminGuard, selfGuard, findByIdClient);
router.put("/:id", clientadminGuard, selfGuard, updateClient);
router.delete("/:id", clientadminGuard, selfGuard, deleteClient);

module.exports = router;
