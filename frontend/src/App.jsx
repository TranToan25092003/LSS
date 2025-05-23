import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { testRouter } from "./routers/client/Test.router";
import { ClerkProvider, SignedIn } from "@clerk/clerk-react";
import HomeLayout from "./pages/HomeLayout";
import { adminRouter } from "./routers/admin/Admin.router";
// import { worker } from "./mocks/browser";
import ErrorPage from "./components/global/Error";
import Lends, { lendLoader } from "./pages/Lends";
import Report, { reportLoader } from "./pages/Report";
import Return from "./pages/Return";
import MySupplies, { mySuppliesLoader } from "./pages/MySupplies";
import BorrowHistory from "./pages/BorrowHistory";
import LendHistory from "./pages/LendHistory";
import Statistics from "./pages/Statistics";

import { routes } from "./routers/client/index";
import { toast } from "react-hot-toast";
import { redirect } from "react-router-dom";

/**
 * ====================================
 * routers
 * ====================================
 */
const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children: [
      testRouter,
      adminRouter,
      {
        path: "lends",
        element: <Lends></Lends>,
        loader: lendLoader,
      },

      {
        path: "report",
        element: <Report></Report>,
        loader: reportLoader,
      },

      {
        path: "return",
        element: <Return></Return>,
      },

      {
        path: "history",
        element: (
          <SignedIn>
            <BorrowHistory />
          </SignedIn>
        ),
      },

      {
        path: "lend-history",
        element: (
          <SignedIn>
            <LendHistory />
          </SignedIn>
        ),
      },

      {
        path: "supplies",
        element: <MySupplies></MySupplies>,
        loader: mySuppliesLoader,
      },

      {
        path: "statistics",
        element: (
          <SignedIn>
            <Statistics />
          </SignedIn>
        ),
        loader: async () => {
          const token = await window.Clerk?.session?.getToken();
          if (!token) {
            toast.error("Bạn cần đăng nhập để xem thống kê");
            return redirect("/");
          }
          return null;
        },
      },

      ...routes,
    ],
    errorElement: <ErrorPage></ErrorPage>,
  },
]);

// worker
//   .start({
//     serviceWorker: {
//       url: "/mockServiceWorker.js",
//       options: {
//         scope: "/",
//       },
//     },
//     onUnhandledRequest: "bypass",
//   })
//   .then(() => {
//     console.log("MSW worker started");
//   })
//   .catch((error) => {
//     console.error("MSW worker failed to start", error);
//   });

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function App() {
  return (
    <>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <RouterProvider router={routers}></RouterProvider>
      </ClerkProvider>
    </>
  );
}

export default App;