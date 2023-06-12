import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import { useParams } from "react-router-dom";

function ProductPage() {
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await ky.get(`api/products/${id}`).json(),
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-xl text-brand">Product Page</h1>

      <div className="text-left">
        <h5 className="text-brand">{product?.name}</h5>
        <h5 className="text-brand text-sm whitespace-pre-line">
          {product?.description}
        </h5>
        <div>RM {product?.price}</div>
        <div>{product?.stock} item left</div>
      </div>
    </div>
  );
}

export default ProductPage;
