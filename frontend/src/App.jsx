import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { testRouter } from "./routers/client/Test.router";
import { ClerkProvider } from "@clerk/clerk-react";
import HomeLayout from "./pages/HomeLayout";
import Test from "./pages/Test";
/**
 * ====================================
 * routers
 * ====================================
 */
const routers = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children: [testRouter],
  },
]);

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
