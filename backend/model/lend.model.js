const { Schema, model } = require("mongoose");

const LendSchema = new Schema(
  {
    item: {
      type: String,
      ref: "item",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },

  { timestamps: true }
);

const Lend = model("lend", LendSchema);

module.exports = Lend;
