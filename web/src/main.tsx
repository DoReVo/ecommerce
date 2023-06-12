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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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

const qClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={qClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
