const { addNewFeedback, findAllFeedbacks, findByIdFeedback, updateFeedback, deleteFeedback } = require("../controllers/feedbacks.controller");
const clientGuard = require("../middleware/guards/client.guard");
const clientadminGuard = require("../middleware/guards/clientadmin.guard");
const selfGuard = require("../middleware/guards/self.guard");


const router = require("express").Router();

router.post("/", clientGuard, addNewFeedback);
router.get("/", findAllFeedbacks);
router.get("/:id", clientadminGuard, selfGuard, findByIdFeedback);
router.put("/:id", clientadminGuard, selfGuard, updateFeedback);
router.delete("/:id", clientadminGuard, selfGuard, deleteFeedback);

module.exports = router;
