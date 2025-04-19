const { Schema, model } = require("mongoose");

const NotifySchema = new Schema(
  {
    toClerkId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
  },

  { timestamps: true }
);

const Notify = model("notify", NotifySchema);

module.exports = Notify;
