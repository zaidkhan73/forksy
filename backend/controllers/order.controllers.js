import { ShopOrderItem } from "../models/order.model.js"
import { Shop } from "../models/shop.model.js"

const placeOrder = async(req,res)=>{
    try {
        const {cartItems, paymentMethod, deliveryAddress, totalAmount} = req.body
        if(cartItems.length === 0 || !cartItems){
            return res.status(400).json({
                message:"Cart is empty"
            })
        }
        if(!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
            return res.status(400).json({
                message:"Delivery address is required"
            })
        }
        if(!paymentMethod){
            return res.status(400).json({
                message:"Payment method is required"
            })
        }

        const groupItemsByShop = {
        }

        cartItems.forEach(item=>{                         //groupItemsByShop = {
            const shopId = item.shop                      //        shop1:[ item1, item2 ],
            if(!groupItemsByShop[shopId]){                //        shop2:[ item1, item2 ]
                groupItemsByShop[shopId] = []             //}
            }
        groupItemsByShop[shopId].push(item)
        })  

        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async(shopId)=>{
            const shop = await Shop.findById(shopId).populate("owner")
            if(!shop){
                return res.status(400).json({
                    message:"Shop not found"
                })
            }
            const items = groupItemsByShop[shopId]

            const subtotal = items.reduce((sum,item)=>{
                return sum + Number(item.price) * Number(item.quantity)
            },0)

            return  {
                shop:shop._id,
                owner:shop.owner._id,
                subtotal,
                ShopOrderItem:items.map((item)=>({
                    item:item._id,
                    quantity:item.quantity,
                    price:item.price,
                    name:item.name,
                }))
            }
            
        }))

        const newOrder = await Order.create({
            user:req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
        })

        return res.status(201).json(newOrder)
        

    
    } catch (error) {
         return res.status(500).json({
      message: "Error while placing the order",
      error: error.message,
    });
    }
}


export {placeOrder}