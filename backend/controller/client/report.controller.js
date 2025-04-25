const Report = require("../../model/report.model");

module.exports.sendReport = async (req, res) => {
  try {
    await Report.create({
      reporterClerkId: req.auth.userId,
      ...req.body,
    });
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: "errors",
    });
  }
};
