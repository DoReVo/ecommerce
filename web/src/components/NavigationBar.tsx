import { Link } from "react-router-dom";
import { useUserQuery } from "../queries";
import { isEmpty } from "lodash-es";
import Button from "./Button";
import { useQueryClient } from "@tanstack/react-query";

export default function NavigationBar() {
  const { data } = useUserQuery();

  const qClient = useQueryClient();

  const isLoggedIn = !isEmpty(data);

  const onPressLogout = () => {
    qClient.resetQueries(["me"]);
    qClient.removeQueries(["me"]);
    localStorage.removeItem("API_TOKEN");
  };

  return (
    <div className="flex justify-between py-4 px-8 border-b border-slate-2">
      <h1>Ecommerce</h1>

      {isLoggedIn ? (
        <div className="p-4 text-lg font-bold text-brand font-mono">
          Hi {data?.name}
        </div>
      ) : null}

      <div className="flex gap-x-2 text-blue-5">
        {data?.isAdmin ? (
          <Link to="/sales-dashboard" className="p-4">
            Sales Dashboard
          </Link>
        ) : null}

        <Link to="/" className="p-4">
          Home
        </Link>

        {!data?.isAdmin ? (
          <Link to="/cart" className="p-4">
            Cart
          </Link>
        ) : null}

        {!isLoggedIn ? (
          <>
            <Link to="/register" className="p-4">
              Register
            </Link>
            <Link to="/login" className="p-4">
              Login
            </Link>
          </>
        ) : (
          <Button
            className="text-brand bg-inherit p-0 m-0"
            onPress={onPressLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}
