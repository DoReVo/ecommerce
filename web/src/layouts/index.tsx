import { Outlet } from "react-router-dom";

export function PageWithNavigationBar() {
  return (
    <>
      <h1>Top bar</h1>
      <Outlet />
    </>
  );
}
