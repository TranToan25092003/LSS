const { Schema, model } = require("mongoose");

const ReturnSchema = new Schema(
  {
    ownerConfirm: {
      type: Boolean,
      default: false,
    },

    borrowerConfirm: {
      type: Boolean,
      required: true,
    },

    borrow: {
      type: Schema.Types.ObjectId,
      ref: "borrow",
      required: true,
    },

    timeReturned: {
      type: Date,
    },

    overTime: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

const Return = model("return", ReturnSchema);

module.exports = Return;
