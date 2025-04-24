const testRouter = require("./test.router");
const itemRouter = require("../item/item.router");
const borrowRouter = require("../item/borrow.router");
const vnpayRouter = require("../vnp/vnpayRouter");


const { checkHeaders } = require("../../middleware/guards/authen.middleware");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { roleProtected } = require("../../middleware/guards/role.middleware");
const { clerkMiddleware, requireAuth, getAuth } = require("@clerk/express");
const { clerkClient } = require("../../config/clerk");


module.exports = (app) => {
  // this router only for testing app do not use this router to write data ok
  app.use("/test", checkHeaders, requireAuth(), roleProtected, testRouter);
  // -------------------------------

  app.use("/vnpay",vnpayRouter)

  app.use("/items",itemRouter);
  app.use("/borrow",borrowRouter);
};
