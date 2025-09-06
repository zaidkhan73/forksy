import { Shop } from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const createAndEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
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
          image: image || shop.image, // preserve old image
          owner: req.userId,
        },
        { new: true }
      );
      await shop.populate("owner");
      return res.status(200).json(shop); // Updated
    }
  } catch (error) {
    console.error("Error creating/updating shop:", error);
    return res
      .status(500)
      .json({ message: "Shop creation failed", error: error.message });
  }
};

export { createAndEditShop };
