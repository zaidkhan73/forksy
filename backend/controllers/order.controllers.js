import { DeliveryAssignment } from "../models/deliveryAssignment.js";
import { Order } from "../models/order.model.js";
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
        .populate("shopOrders.shopOrderItem.item", "name price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

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

    let deliveryBoyPayload = [];

    if (status === "out for delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((d) => d._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: {
          $in: nearByIds,
        },
        status: {
          $nin: ["broadcasted", "completed"],
        },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds);

      const availableBoys = nearByDeliveryBoys.filter(
        (d) => !busyIdSet.has(String(d._id))
      );
      const candidates = availableBoys.map((n) => n._id);

      if (candidates.length === 0) {
        await shopOrder.save();
        await order.save();
        return res.status(400).json({
          message: "order status updated but no deliveryBoy available",
        });
      }

      let deliveryAssignment = await DeliveryAssignment.findOne({
        shopOrderId: shopOrder._id,
      });

      if (!deliveryAssignment) {
        deliveryAssignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopOrder.shop,
          shopOrderId: shopOrder._id,
          broadcastedTo: candidates,
          status: "broadcasted",
        });
      }

      //   const deliveryAssignment = await DeliveryAssignment.create({
      //     order: order._id,
      //     shop: shopOrder.shop,
      //     shopOrderId: shopOrder._id,
      //     broadcastedTo: candidates,
      //     status: "broadcasted",
      //   });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

      shopOrder.assignment = deliveryAssignment._id;

      deliveryBoyPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        mobile: b.mobile,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
      }));
    }

    const updatedShopOrder = order.shopOrders.find((o) => o.shop === shopId);

    await shopOrder.save();
    await order.save();

    await order.populate("shopOrders.shop", "name image");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    );

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoyPayload,
      assignemnt: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating order status",
      error: error.message,
    });
  }
};

const getAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignment = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted"
    }).populate("order shop");

    const formatedData = assignment.map(a => {
      const shopOrder = a.order.shopOrders.find(o =>
        o._id.equals(a.shopOrderId)   
      );

      return {
        assignmentId: a._id,
        orderId: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order.deliveryAddress,
        items: shopOrder?.shopOrderItem || [],
        subtotal: shopOrder?.subtotal || 0
      };
    });

    return res.status(200).json(formatedData);
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting assignment",
      error: error.message,
    });
  }
};

const acceptOrder = async (req, res) => {
    try {
        const {assignmentId} = req.params
        const assignment = await DeliveryAssignment.findById(assignmentId)
        if(!assignment){
            return res.status(400).json({
                message:"Assignment not found"
            })
        }
        if(assignment.status !== "broadcasted"){
            return res.status(400).json({
                message:"Assignment is expired"
            })
        }
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo:req.userId,
            status:{
                $nin:["broadcasted","completed"]
            }
        })
        if(alreadyAssigned){
            return res.status(400).json({
                message:"You have already assigned an order"
            })
        }

        assignment.assignedTo = req.userId
        assignment.status = "assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        const order = await Order.findById(assignment.order)
        if(!order){
            return res.status(400).json({
                message:"Order not found"
            })
        }
        const shopOrder = order.shopOrders.find(o=>o._id.equals(assignment.shopOrderId))
        shopOrder.assignedDeliveryBoy = req.userId

        await order.save()
        await order.populate("shopOrders.assignedDeliveryBoy")
        return res.status(200).json({
            message:"Order accepted",
        })


    } catch (error) {
        return res.status(500).json({
            message:"Error while accepting order",
            error:error.message
        })
    }
}

const getAcceptedOrder = async (req, res) => {
    try {
        const assignment = await DeliveryAssignment.findOne({
            assignedTo:req.userId,
            status:"assigned"
        }).populate("shop","name").populate("assignedTo","fullName email mobile location").populate({
            path:"order",
            populate:[{path:"user",select:"fullName email location mobile"}]
        })

        if(!assignment){
            return res.status(400).json({
                message:"No accepted order found"
            })
        }

        if(!assignment.order){
            return res.status(400).json({
                message:"Order not found"
            })
        }

         await assignment.order.populate("shopOrders.shop" , "name");

        const shopOrder = assignment.order.shopOrders.find(o=>String(o._id)==String(assignment.shopOrderId))
        //await shopOrder.populate("shop")

        if(!shopOrder){
            return res.status(400).json({
                message:"Shop order not found"
            })
        }

        let deliveryBoyLocation = {lat:null,lon:null}
        if(assignment.assignedTo.location.coordinates.length === 2){
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }
        

        let customerLocation = {lat:null,lon:null}
        if(assignment.order.deliveryAddress){
            customerLocation.lat = assignment.order.deliveryAddress.latitude
        customerLocation.lon = assignment.order.deliveryAddress.longitude
        }
        


        return res.status(200).json({
            id:assignment._id,
            user:assignment.order.user,
            shopOrder:shopOrder,
            deliveryAddress:assignment.order.deliveryAddress,
            deliveryBoyLocation:deliveryBoyLocation,
            customerLocation:customerLocation
        })

    } catch (error) {
        return res.status(500).json({
            message:"Error while getting accepted order",
            error:error.message
        })
    }
}

const getOrderById = async(req,res) => {
    try {
        const {orderId} = req.params
        const order = await Order.findById(orderId).populate("user").populate({
            path:"shopOrders.shop",
            model:"Shop"
        }).populate({
            path:"shopOrders.assignedDeliveryBoy",
            model:"User"
        }).populate({
            path:"shopOrders.shopOrderItem.item",
            model:"Item"
        }).lean()
        if(!order){
            return res.status(400).json({
                message:"Order not found"
            })
        }

        return res.status(200).json(order)
        
    } catch (error) {
        return res.status(500).json({
            message:"Error while getting order by id",
            error:error.message
        })
    }
}

export { placeOrder, getOrders, updateOrderStatus, getAssignment, acceptOrder, getAcceptedOrder, getOrderById };
