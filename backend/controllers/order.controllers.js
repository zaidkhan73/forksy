import { Order, ShopOrderItem } from "../models/order.model.js";
import { Shop } from "../models/shop.model.js";
import { User } from "../models/user.model.js";

const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (cartItems.length === 0 || !cartItems) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({
        message: "Delivery address is required",
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      //groupItemsByShop = {
      const shopId = item.shop; //        shop1:[ item1, item2 ],
      if (!groupItemsByShop[shopId]) {
        //        shop2:[ item1, item2 ]
        groupItemsByShop[shopId] = []; //}
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({
            message: "Shop not found",
          });
        }
        const items = groupItemsByShop[shopId];

        const subtotal = items.reduce((sum, item) => {
          return sum + Number(item.price) * Number(item.quantity);
        }, 0);

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItem: items.map((item) => ({
            item: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate("shopOrders.shopOrderItems.item", "name price");
    await newOrder.populate("shopOrders.shop", "name image");
    await newOrder.populate("shopOrders.owner", "name email mobile");
    await newOrder.populate("user");

    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({
      message: "Error while placing the order",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItem.item", "name price ");

      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name image")
        .populate("user")
        .populate("shopOrders.shopOrderItem.item", "name price");

      const filteredOrder = orders.map((order) => ({
        _id: order._id,
        user: order.user,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        totalAmount: order.totalAmount,
        shopOrders: order.shopOrders.filter(
          (o) => o.owner._id.toString() === req.userId.toString()
        ), // 👈 yeh filter karega
        createdAt: order.createdAt,
      }));

      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting orders",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    const shopOrder = order.shopOrders.find(
      (o) => o.shop.toString() === shopId.toString()
    );

    if (!shopOrder) {
      return res.status(400).json({
        message: "Shop order not found",
      });
    }

    // update status
    shopOrder.status = status;
    await shopOrder.save();
    await order.save();


    return res.status(200).json(shopOrder.status);
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating order status",
      error: error.message,
    });
  }
};


export { placeOrder, getOrders, updateOrderStatus };
