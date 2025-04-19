const { Schema, model } = require("mongoose");

const BorrowSchema = new Schema(
  {
    borrowerClerkId: {
      type: String,
      required: true,
    },

    totalTime: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    item: {
      type: String,
      ref: "item",
      required: true,
    },
  },

  { timestamps: true }
);

const Borrow = model("borrow", BorrowSchema);

module.exports = Borrow;
