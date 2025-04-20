
import ListAllItem from "../../pages/ListItemPage";
import DetailItem from "../../pages/ItemDetailPage";

export const routes = [
  {
    path: "/listItem",
    Element: ListAllItem,
  },
  {
    path: "/listItem/:itemId",
    Element: DetailItem,
  }

];