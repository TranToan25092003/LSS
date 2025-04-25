const { Schema, model } = require("mongoose");

const ProblemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    reporterClerkId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Problem = model("problem", ProblemSchema);

module.exports = Problem;
