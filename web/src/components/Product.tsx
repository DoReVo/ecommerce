import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import ProductCard from "./ProductCard";
import { useAtom } from "jotai";
import { searchTermAtom } from "../atoms";
import Fuse from "fuse.js";
import { isEmpty } from "lodash-es";

export function ProductList() {
  const [searchTerm] = useAtom(searchTermAtom);
  const { data } = useQuery({
    queryKey: ["product-list"],
    queryFn: async () => await ky.get("api/products").json(),
    select(data) {
      const fuse = new Fuse(data, {
        keys: ["name"],
        isCaseSensitive: false,
        threshold: 0.3,
      });

      if (isEmpty(searchTerm)) return data;

      const result = fuse.search(searchTerm);


      return result.map((entry) => entry?.item);
    },
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {data?.map((entry) => (
        <ProductCard product={entry} />
      ))}
    </div>
  );
}
