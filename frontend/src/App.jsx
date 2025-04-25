import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { testRouter } from "./routers/client/Test.router";
import { ClerkProvider } from "@clerk/clerk-react";
import HomeLayout from "./pages/HomeLayout";
import { adminRouter } from "./routers/admin/Admin.router";
import ErrorPage from "./components/global/Error";
import Lends, { lendLoader } from "./pages/Lends";
import Report, { reportLoader } from "./pages/Report";
import Return from "./pages/Return";
import MySupplies, { mySuppliesLoader } from "./pages/MySupplies";
import BorrowHistory from "./pages/BorrowHistory";
import LendHistory from "./pages/LendHistory";
import { routes } from "./routers/client/index";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...routes,
      {
        path: "lends",
        element: <Lends />,
        loader: lendLoader,
      },
      {
        path: "report",
        element: <Report />,
        loader: reportLoader,
      },
      {
        path: "return",
        element: <Return />,
      },
      {
        path: "supplies",
        element: <MySupplies />,
        loader: mySuppliesLoader,
      },
      {
        path: "history",
        element: <BorrowHistory />,
      },
      {
        path: "lend-history",
        element: <LendHistory />,
      },
    ],
  },
  adminRouter,
  testRouter,
]);

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}

export default App;
