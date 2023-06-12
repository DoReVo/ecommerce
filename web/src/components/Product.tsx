import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import { ProductRoute } from "common";
import { usePress } from "react-aria";
import { useNavigate } from "react-router-dom";

/** Product Card */
function ProductCard(props: { product: ProductRoute.Product }) {
  const { product } = props;

  const navigate = useNavigate();

  const onPressProduct = () => {
    navigate(`/product/${product?.id}`);
  };

  const { pressProps } = usePress({
    allowTextSelectionOnPress: true,
    onPress: onPressProduct,
  });

  return (
    <div className="shadow-sm p-4 cursor-pointer" {...pressProps}>
      <h5 className="text-brand">{product?.name}</h5>
      <div>RM {product?.price}</div>
      <div>{product?.stock} item left</div>
    </div>
  );
}

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
