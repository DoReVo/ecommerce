import kyFactory from "ky";
import { isEmpty, isNull } from "lodash-es";

export function createKy() {
  return kyFactory.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    hooks: {
      beforeRequest: [
        (req) => {
          const token = localStorage.getItem("API_TOKEN");

          if (!isEmpty(token) && !isNull(token))
            req.headers.set("Authorization", token);
        },
      ],
    },
  });
}

export const ky = createKy();
