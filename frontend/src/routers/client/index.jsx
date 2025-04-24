import ListAllItem from "../../pages/ListItemPage";
import DetailItem from "../../pages/ItemDetailPage";
import CheckOut, { checkoutLoader } from "../../pages/CheckOutItem";
import VNPayReturn from "../../pages/VnpayReturn";

export const routes = [
  {
    index: true,
    element: <ListAllItem></ListAllItem>,
  },
  {
    path: "/listItem/:itemId",
    element: <DetailItem></DetailItem>,
  },
  {
    path: "/checkout-item",
    element: <CheckOut></CheckOut>,
    loader: checkoutLoader,
  },
  {
    path: "/return-vnpay",
    element: <VNPayReturn></VNPayReturn>,
    loader: checkoutLoader,
  },
];
