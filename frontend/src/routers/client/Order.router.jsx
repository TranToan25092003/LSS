import Order from "@/pages/Order";

export const orderRouter = {
  path: "/orders",
  element: <Order></Order>,
  errorElement: <h1>Error loading orders</h1>,
};
