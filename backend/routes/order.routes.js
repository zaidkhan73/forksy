import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getAssignment, getOrders, placeOrder, updateOrderStatus } from "../controllers/order.controllers.js"


const orderRouter = express.Router()


orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/get-order",isAuth,getOrders)
orderRouter.post("/set-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRouter.get("/get-assignments",isAuth,getAssignment)

export default orderRouter