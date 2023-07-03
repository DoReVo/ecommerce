import { Link, useNavigate } from "react-router-dom";
import { useUserQuery } from "../queries";
import { isEmpty } from "lodash-es";
import Button from "./Button";
import { useQueryClient } from "@tanstack/react-query";

export default function NavigationBar() {
  const { data } = useUserQuery();

  const qClient = useQueryClient();

  const isLoggedIn = !isEmpty(data);

  const nav = useNavigate();

  const onPressLogout = () => {
    qClient.resetQueries(["me"]);
    qClient.removeQueries(["me"]);
    localStorage.removeItem("API_TOKEN");

    nav("/");
  };

  return (
    <div className="flex justify-between py-2 px-8 border-b border-slate-2 w-full">
      <div className="flex justify-center items-center text-center">
        <img className="max-w-35" src="/logo.png"></img>
        <div className="w-full">Mesrinah Food Enterprise</div>
      </div>

      {isLoggedIn ? (
        <div className="p-4 text-lg font-bold text-brand font-mono">
          Hi {data?.name}
        </div>
      ) : null}

      <div className="flex gap-x-2 text-blue-5">
        {data?.id && data?.isAdmin ? (
          <Link to="/sales-dashboard" className="p-4">
            Sales Dashboard
          </Link>
        ) : null}

        {data?.id && !data?.isAdmin ? (
          <Link to="/purchase-history" className="p-4">
            Purchase History
          </Link>
        ) : null}

        <Link to="/" className="p-4">
          Home
        </Link>

        {data?.id && !data?.isAdmin ? (
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
          <div className="p-4">
            <Button
              className="text-brand bg-inherit p-0! m-0"
              onPress={onPressLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
