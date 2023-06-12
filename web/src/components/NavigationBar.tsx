import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createKy } from "../utility";

const ky = createKy();

export default function NavigationBar() {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: async () => await ky.get("api/users/me").json(),
    staleTime: 60000,
  });

  return (
    <div className="flex justify-between p-4">
      <h1>Ecommerce</h1>

      <div>Hi {data?.name}</div>

      <div className="flex gap-x-2 text-blue-5">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
