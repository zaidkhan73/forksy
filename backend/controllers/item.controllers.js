import { Item } from "../models/item.model.js";
import { Shop } from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId })
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner")
    await shop.populate({
      path:"items",
      options:{
        sort:{
          updatedAt:-1
        }
      }
    });


    return res.status(201).json(shop); // Created
  } catch (error) {
    return res.status(500).json({
      message: "Error while adding item",
      error: error.message,
    });
  }
};

const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, foodType, category, price } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const oldItem = await Item.findById(itemId);
    if (!oldItem) {
      return res.status(400).json({ message: "Item not found" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        price,
        foodType,
        category,
        image: image || oldItem.image, // preserve old image
      },
      { new: true }
    )

    if(!updatedItem){
      return res.status(400).json({ message: "Error while editing item" });
    }

    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path:"items",
      options:{
        sort:{
          updatedAt:-1
        }
      }
    });


    return res.status(200).json(shop); 
  } catch (error) {
    return res.status(500).json({
      message: "Error while editing item",
      error: error.message,
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching item",
      error: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // delete the item
    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // remove item reference from shop
    const shop = await Shop.findOne({ owner: req.userId });
    if (shop) {
      shop.items = shop.items.filter(i => String(i._id) !== itemId);
      await shop.save();
      await shop.populate({
        path:"items",
        options:{
          sort:{
            updatedAt:-1
          }
        }
      });
    }

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({
      message: "Error while deleting item",
      error: error.message
    });
  }
};

const getItemByCity = async (req, res) => {
  try {
    const {city} = req.params

    if(!city){
      return res.status(400).json({
        message:"City is required"
      })
    }

    const shops = await Shop.find({
          city:{$regex:new RegExp(`^${city}$`, "i")}
    }).populate("items")
    if(!shops){
          return res.status(404).json({message:"No shops found"})
    }
    const shopIds = shops.map(shop=>shop._id)
    
    const items = await Item.find({
      shop:{$in:shopIds}
    }).populate("shop", "name city isOpen openingTime closingTime")
    
    if(!items){
      return res.status(404).json({message:"No items found"})
    }
    return res.status(200).json(items)
    
  } catch (error) {
    return res.status(500).json({
      message: "Error in getItemByCity",
      error: error.message
    })
  }
}

export { addItem, editItem , getItemById, deleteItem, getItemByCity };
