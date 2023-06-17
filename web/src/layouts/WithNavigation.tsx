import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

export function WithNavigation() {
  return (
    <>
      <NavigationBar />
      <div className="font-sans p-8 max-w-5xl mx-auto">
        <Outlet />
      </div>
    </>
  );
}
