const { requireAuth } = require("@clerk/express");
const { checkHeaders } = require("../../middleware/guards/authen.middleware");
const reviewRouter = require("./review.router");
const historyRouter = require("./history.router");
const { roleProtected } = require("../../middleware/guards/role.middleware");

module.exports = (app) => {
  app.use(
    "/admin/reviews",
    checkHeaders,
    requireAuth(),
    roleProtected,
    reviewRouter
  );

  app.use(
    "/admin/history",
    checkHeaders,
    requireAuth(),
    roleProtected,
    historyRouter
  );
};
