import { useQuery } from "@tanstack/react-query";
import { createKy } from "../utility";
import { UserRoute } from "common";

const ky = createKy();

export function useUserQuery() {
  return useQuery<UserRoute.User>({
    queryKey: ["me"],
    queryFn: async () => await ky.get("api/users/me").json(),
    enabled: !!localStorage.getItem("API_TOKEN"),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
