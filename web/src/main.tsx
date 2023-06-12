import React from "react";
import ReactDOM from "react-dom/client";
import "@unocss/reset/tailwind-compat.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "virtual:uno.css";
import HomePage from "./pages/HomePage.tsx";
import { PageWithNavigationBar } from "./layouts/index.tsx";
import Loginpage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<PageWithNavigationBar />}>
        <Route path="" element={<HomePage />} />
        <Route path="login" element={<Loginpage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
