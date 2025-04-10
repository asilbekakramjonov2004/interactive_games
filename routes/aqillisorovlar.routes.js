const { getClientPayments, getTopOwnersCategory, getRentedProductsByDate, getDamagedProductsClients, getCancelledContractsClients } = require("../controllers/aqllisorovlar.controller");
const adminGuard = require("../middleware/guards/admin.guard");

const router = require("express").Router();

router.post("/client-payments", adminGuard, getClientPayments);
router.get("/top-owners/:id", adminGuard, getTopOwnersCategory);
router.post("/rented-products", adminGuard, getRentedProductsByDate);
router.post("/damaged-products-clients", adminGuard, getDamagedProductsClients);
router.post("/cancelled-contracts-clients", adminGuard, getCancelledContractsClients);

module.exports = router;
