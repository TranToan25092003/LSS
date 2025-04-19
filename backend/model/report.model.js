const { Schema, model } = require("mongoose");

const ReportSchema = new Schema(
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
    },
  },
  { timestamps: true }
);

const Report = model("report", ReportSchema);

module.exports = Report;
