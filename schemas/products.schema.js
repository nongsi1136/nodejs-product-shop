import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  authorName: { type: String, required: true },

  password: { type: String, required: true },
  status: { type: String, enum: ["FOR_SALE", "SOLD_OUT"], default: "FOR_SALE" },

  timestamps: true,
});

export default mongoose.model("Product", ProductSchema);
