const { Schema, model } = require("mongoose");

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    details: {
      type: String,
    },
  },
  { timestamps: true }
);

const ActivityLog = model("activityLog", activityLogSchema);

module.exports = ActivityLog;
