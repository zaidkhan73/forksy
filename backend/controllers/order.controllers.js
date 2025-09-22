const placeOrder = async(req,res)=>{
    try {
        const {cartItems, paymentMethod, deliveryAddress} = req.body
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

        cartItems.forEach(item=>{
            const shopId = item.shop
            if(!groupItemsByShop[shopId]){
                groupItemsByShop[item.shop] = []
            }
            groupItemsByShop[item.shop].push(item)
        })
    } catch (error) {
         return res.status(500).json({
      message: "Error while placing the order",
      error: error.message,
    });
    }
}


export {placeOrder}