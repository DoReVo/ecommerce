import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import Footer from "../components/Footer";

export function WithNavigation() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <NavigationBar />
      <div className="font-sans p-8 w-full max-w-6xl grow">
        <Outlet />
      </div>
      <Footer  />
    </div>
  );
}
