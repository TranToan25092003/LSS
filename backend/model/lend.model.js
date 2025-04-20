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

    rejectReason: {
      type: String,
    },
  },

  { timestamps: true }
);

const Lend = model("lends", LendSchema);

module.exports = Lend;
