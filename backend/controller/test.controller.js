const ActivityLog = require("../model/log.model");

module.exports.checkHealth = async (req, res) => {
  console.log(req.userId);

  res.status(200).json({
    message: "System is healthy",
  });
};
