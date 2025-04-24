
import ListAllItem from "../../pages/ListItemPage";
import DetailItem from "../../pages/ItemDetailPage";
import CheckOut from "../../pages/CheckOutItem";
import VNPayReturn from "../../pages/VnpayReturn";

export const routes = [
  {
    path: "/listItem",
    element: <ListAllItem></ListAllItem>,
    errorElement: <h1>error</h1>,
  },
  {
    path: "/listItem/:itemId",
    element: <DetailItem></DetailItem>,
    errorElement: <h1>error</h1>,
  },
  {
    path: "/checkout-item",
    element: <CheckOut></CheckOut>,
    errorElement: <h1>error</h1>,
  },
  {
    path: "/return-vnpay",
    element: <VNPayReturn></VNPayReturn>,
    errorElement: <h1>error</h1>,
  }
];