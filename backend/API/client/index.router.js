const testRouter = require("./test.router");

const { checkHeaders } = require("../../middleware/guards/authen.middleware");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { roleProtected } = require("../../middleware/guards/role.middleware");
const { clerkMiddleware, requireAuth, getAuth } = require("@clerk/express");
const { clerkClient } = require("../../config/clerk");
module.exports = (app) => {
  // this router only for testing app do not use this router to write data ok
  app.use("/test", checkHeaders, requireAuth(), roleProtected, testRouter);
  // -------------------------------
};
