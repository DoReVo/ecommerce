import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export function PageWithNavigationBar() {
  return (
    <>
      <NavigationBar />
      <div className="font-sans">
        <Outlet />
      </div>
    </>
  );
}
