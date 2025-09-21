import { createAndEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js"
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"

const shopRouter = express.Router()

shopRouter.post("/create-edit-shop",isAuth,upload.single("image"),createAndEditShop)
shopRouter.get("/get-shop",isAuth,getMyShop)
shopRouter.get("/get-by-city/:city",isAuth,getShopByCity)

export default shopRouter