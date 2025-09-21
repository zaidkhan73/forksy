import mongoose from "mongoose";

const shopSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item"
    }
  ],

  // 🕒 New fields with defaults
  openingTime: {
    type: String, // Format: "HH:mm"
    default: "09:00",
    required:true
  },
  closingTime: {
    type: String, // Format: "HH:mm"
    default: "21:00",
    required:true
  },
  isOpen: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
});

export const Shop = mongoose.model("Shop", shopSchema);
