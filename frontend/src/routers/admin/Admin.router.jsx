import ErrorPage from "@/components/global/Error";
import DashboardLayout from "@/pages/DashboardLayout";
import ReportAdmin, { reportAdminLoader } from "@/pages/ReportAdmin";
import Review, { reviewLoader } from "@/pages/Review";
import { SupplyCard } from "@/pages/SupllyCard";
import SuppliesAdmin, {
  suppliesLoader,
  suppliesRejectLoader,
} from "@/pages/SuppliesAdmin";
import { authenTicationLoader } from "@/utils/authentication.loader";

// this router is for testing
export const adminRouter = {
  path: "/admin",
  element: <DashboardLayout></DashboardLayout>,
  errorElement: <ErrorPage></ErrorPage>,
  loader: authenTicationLoader,
  children: [
    {
      index: true,

      element: <Review></Review>,
      loader: reviewLoader,
    },

    {
      path: "supplies",
      element: <SuppliesAdmin></SuppliesAdmin>,
      loader: suppliesLoader,
    },

    {
      path: "supplies/:id",
      element: <SupplyCard></SupplyCard>,
    },

    {
      path: "reject",
      element: <SuppliesAdmin></SuppliesAdmin>,
      loader: suppliesRejectLoader,
    },

    {
      path: "report",
      element: <ReportAdmin></ReportAdmin>,
      loader: reportAdminLoader,
    },
  ],
};
