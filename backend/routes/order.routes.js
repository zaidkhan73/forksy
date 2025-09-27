import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getOrders, placeOrder } from "../controllers/order.controllers.js"


const orderRouter = express.Router()


orderRouter.post("/place-order",isAuth,placeOrder)
orderRouter.get("/get-order",isAuth,getOrders)

export default orderRouter