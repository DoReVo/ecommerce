import React from "react";
import ReactDOM from "react-dom/client";
import "@unocss/reset/tailwind-compat.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import { PageWithNavigationBar } from "./layouts/index.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<PageWithNavigationBar />}>
        <Route path="" element={<HomePage />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
