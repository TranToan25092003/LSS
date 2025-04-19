const { Schema, model } = require("mongoose");

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    rate: {
      type: String,
      enum: ["day", "hour"],
      required: true,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    ownerClerkId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "notAvailable"],
      default: "notAvailable",
    },
  },

  { timestamps: true }
);

const Item = model("item", ItemSchema);

module.exports = Item;
