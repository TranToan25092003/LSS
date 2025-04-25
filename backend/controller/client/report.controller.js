const Problem = require("../../model/problems.model");

module.exports.sendReport = async (req, res) => {
  try {
    await Problem.create({
      reporterClerkId: req.auth.userId,
      ...req.body,
    });
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "errors",
    });
  }
};
