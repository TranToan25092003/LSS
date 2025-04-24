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
      required: true,
    },

    itemId: {
      type: String,
      ref: "item",
      required: true,
    },

    borrowId: {
      type: String,
      ref: "borrow",
      required: true,
    },

    type: {
      type: String,
      enum: ["damage", "late_return", "lost", "other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "resolved", "rejected"],
      default: "pending",
    },

    resolution: {
      type: String,
    },

    resolvedAt: {
      type: Date,
    },

    images: [
      {
        type: String, // URL của ảnh
      },
    ],
  },
  { timestamps: true }
);

const Report = model("report", ReportSchema);

module.exports = Report;
