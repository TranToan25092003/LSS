const { clerkClient } = require("../../config/clerk");
const { Problem } = require("../../model");
const Borrow = require("../../model/borrow.model");
const Report = require("../../model/report.model");
const Return = require("../../model/returned.model");

/**
 * ====================================
 * [GET] /admin/history
 * get all lends
 * ====================================
 */
module.exports.getHistory = async (req, res) => {
  const borrow = await Return.find({
    ownerConfirm: true,
  }).populate("borrow");

  return res.json({
    data: borrow,
  });
};

/**
 * ====================================
 * [GET] /admin/history/report
 * ====================================
 */
module.exports.getReport = async (req, res) => {
  const reports = await Problem.find().sort({ createdAt: 1 });

  const data = await Promise.all(
    reports.map(async (r) => {
      const { firstName, lastName, imageUrl, emailAddresses } =
        await clerkClient.users.getUser(r.reporterClerkId);

      return {
        report: r,
        user: {
          firstName,
          lastName,
          imageUrl,
          email: emailAddresses[0].emailAddress,
        },
      };
    })
  );

  return res.status(200).json({
    message: "success",
    data: data,
  });
};
