import { Link } from "react-router-dom";
import { useUserQuery } from "../queries";

export default function NavigationBar() {
  const { data } = useUserQuery();

  return (
    <div className="flex justify-between p-4">
      <h1>Ecommerce</h1>

      <div>Hi {data?.name}</div>

      <div className="flex gap-x-2 text-blue-5">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
