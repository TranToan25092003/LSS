const { Schema, model } = require("mongoose");

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedByClerkId: {
      type: String,
      required: true,
    },

    details: {
      type: String,
    },
  },
  { timestamps: true }
);

const ActivityLog = model("activityLog", activityLogSchema);

module.exports = ActivityLog;
