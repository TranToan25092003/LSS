const { Clerk } = require("@clerk/clerk-sdk-node");

module.exports.checkHeaders = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.includes("undefined")
  ) {
    console.log("No valid Authorization header found");
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  next();
};
