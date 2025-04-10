const router=require("express").Router()

const adminsRoute=require("./admins.routes")
const ownersRoute=require("./owners.routes")
const clientsRoute=require("./clients.routes")
const categoryRoute =require("./categories.routes")
const statusRoute =require("./status.routes")
const tarifRoute =require("./tarif.routes")
const productRoute =require("./products.routes")
const contractRoute =require("./contracts.routes")
const paymentRoute =require("./payments.routes")
const feedbackRoute =require("./feedbacks.routes")
const aqillisorovRoute =require("./aqillisorovlar.routes")



router.use("/admins",adminsRoute)
router.use("/owners", ownersRoute)
router.use("/clients", clientsRoute)
router.use("/categories", categoryRoute)
router.use("/status", statusRoute)
router.use("/tarif", tarifRoute)
router.use("/products", productRoute)
router.use("/contracts", contractRoute)
router.use("/payments", paymentRoute)
router.use("/feedback", feedbackRoute)
router.use("/aqilli-sorov", aqillisorovRoute)



module.exports=router