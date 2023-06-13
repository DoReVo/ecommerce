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
    <div className="p-4 cursor-pointer shadow rounded-md min-w-40 max-w-sm" {...pressProps}>
      <h5 className="text-slate-6 text-2xl font-bold">{product?.name}</h5>
      <div className="text-brand font-bold text-xl italic mt-4">RM {product?.price}</div>
      <div className="bg-slate-6 text-white p-1 text-sm rounded w-fit h-fit">{product?.stock} item left</div>
    </div>
  );
}

export default ProductCard;
