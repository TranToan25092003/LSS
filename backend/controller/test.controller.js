const ActivityLog = require("../model/log.model");

module.exports.checkHealth = async (req, res) => {
  await ActivityLog.create({
    action: "hello",
    details: "a",
  });
  res.status(200).json({
    message: "System is healthy",
  });
};
