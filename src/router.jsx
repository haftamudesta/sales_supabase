import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import SignIn from "./components/SignIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
]);
