import { Shop } from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createAndEditShop = async (req, res) => {
  try {
    const { name, city, state, address, openingTime, closingTime, isOpen } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        openingTime,
        closingTime,
        isOpen,
        owner: req.userId,
      });
      await shop.populate("owner");
      return res.status(201).json(shop); // Created
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          openingTime,
          closingTime,
          isOpen,
          image: image || shop.image,
          owner: req.userId,
        },
        { new: true }
      );
      await shop.populate("owner items");
      return res.status(200).json(shop); // Updated
    }
  } catch (error) {
    console.error("Error creating/updating shop:", error);
    return res
      .status(500)
      .json({ message: "Shop creation failed", error: error.message });
  }
};

const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
      path:"items",
      options:{
        sort:{
          updatedAt:-1
        }
      }
    })
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop); 
  } catch (error) {
    console.error("Error in getting shop:", error);
    return res
      .status(500)
      .json({ message: "getMyShop failed", error: error.message });
  }
}

const getShopByCity = async(req,res) => {
  try {
    const {city} = req.params
    const shops = await Shop.find({
      city:{$regex:new RegExp(`^${city}$`, "i")}
    }).populate("items")
    if(!shops){
      return res.status(404).json({message:"No shops found"})
    }else{
      return res.status(200).json(shops)
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "getShopByCity failed", error: error.message });
  }
}

export { 
  createAndEditShop,
  getMyShop,
getShopByCity };
