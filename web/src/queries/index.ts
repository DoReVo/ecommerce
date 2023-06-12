import { useQuery } from "@tanstack/react-query";
import { createKy } from "../utility";
import { UserRoute } from "common";

const ky = createKy();

export function useUserQuery() {
  return useQuery<UserRoute.User>({
    queryKey: ["me"],
    queryFn: async () => await ky.get("api/users/me").json(),
    staleTime: 60000,
  });
}
