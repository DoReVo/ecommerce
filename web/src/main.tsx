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
import { WithNavigation } from "./layouts/index.tsx";
import Loginpage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProductPage from "./pages/ProductPage.tsx";
import CartPage from "./pages/CartPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element={<WithNavigation />}>
        <Route path="" element={<HomePage />} />
        <Route path="login" element={<Loginpage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
      </Route>
    </>
  )
);

const qClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 1500,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={qClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
