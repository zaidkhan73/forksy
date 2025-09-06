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

    const shop = await Shop.findOne({ owner: req.userId });
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

    await item.populate("shop");

    return res.status(201).json(item); // Created
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
    ).populate("shop");

    return res.status(200).json(updatedItem); // OK
  } catch (error) {
    return res.status(500).json({
      message: "Error while editing item",
      error: error.message,
    });
  }
};

export { addItem, editItem };
