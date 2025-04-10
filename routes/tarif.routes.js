const { addNewTarif, findAllTarif, findByIdTarif, updateTarif, deleteTarif } = require("../controllers/tarif.controller");
const adminGuard = require("../middleware/guards/admin.guard");

const router = require("express").Router();

router.post("/", adminGuard, addNewTarif); 
router.get("/", adminGuard, findAllTarif);  
router.get("/:id", adminGuard, findByIdTarif);  
router.put("/:id", adminGuard, updateTarif);  
router.delete("/:id", adminGuard, deleteTarif); 

module.exports = router;
