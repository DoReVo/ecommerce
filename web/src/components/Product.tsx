import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import ProductCard from "./ProductCard";

export function ProductList() {
  const { data } = useQuery({
    queryKey: ["product-list"],
    queryFn: async () => await ky.get("api/products").json(),
  });

  return (
    <div className="flex gap-4 flex-wrap">
      {data?.map((entry) => (
        <ProductCard product={entry} />
      ))}
    </div>
  );
}
