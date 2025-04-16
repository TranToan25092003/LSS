import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Test from "./pages/Test";

/**
 * ====================================
 * routers
 * ====================================
 */
const routers = createBrowserRouter([
  {
    path: "/",
    element: <Test></Test>,
    errorElement: <h1>error</h1>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={routers}></RouterProvider>
    </>
  );
}

export default App;
