
import ListAllItem from "../../pages/ListItemPage";
import DetailItem from "../../pages/ItemDetailPage";

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
  }
];