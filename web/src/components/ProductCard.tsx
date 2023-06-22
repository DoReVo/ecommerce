import { ProductRoute } from "common";
import { isEmpty } from "lodash-es";
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

  const images = product?.productImages;
  const imageToDisplay = images?.at(0);

  return (
    <div
      className="p-4 cursor-pointer shadow rounded-md min-w-40"
      {...pressProps}
    >
      {!isEmpty(images) ? (
        <div className="flex justify-center items-center">
          <img
            className="aspect-video max-w-200px"
            src={`${import.meta.env.VITE_API_URL}/api/images/product-image/${
              imageToDisplay?.id
            }/${imageToDisplay?.fileName}`}
          />
        </div>
      ) : null}
      <h5 className="text-slate-6 text-2xl font-bold">{product?.name}</h5>
      <div className="text-brand font-bold text-xl italic mt-4">
        RM {product?.price}
      </div>
      <div className="bg-slate-6 text-white p-1 text-sm rounded w-fit h-fit">
        {product?.stock} item left
      </div>
    </div>
  );
}

export default ProductCard;
