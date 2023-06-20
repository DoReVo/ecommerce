import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createKy } from "../utility";
import { UserRoute } from "common";
import { isEmpty, isNull } from "lodash-es";

const ky = createKy();

export function useUserQuery() {
  const token = localStorage.getItem("API_TOKEN");

  return useQuery<UserRoute.User>({
    queryKey: ["me"],
    queryFn: async () => await ky.get("api/users/me").json(),
    enabled: !isEmpty(token) && !isNull(token),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}

export function useAddToCartQuery({ successCb }: { successCb?: () => void }) {
  const qClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      return await ky.post("api/cart", { json: data }).json();
    },
    onSuccess: () => {
      qClient.invalidateQueries(["cart"]);
      if (successCb) successCb();
    },
  });
}
