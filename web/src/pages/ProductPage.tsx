import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAtom } from "jotai";
import { isEditingProductIDAtom, isOpenProductFormAtom } from "../atoms";
import ProductFormModal from "../components/ProductFormModal";

function ProductPage() {
  const [isEditingID, setIsEditingID] = useAtom(isEditingProductIDAtom);
  const [, setIsOpen] = useAtom(isOpenProductFormAtom);
  const { id } = useParams();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await ky.get(`api/products/${id}`).json(),
  });

  const onEditPress = () => {
    setIsEditingID(id as any);
    setIsOpen(true);
  };

  return (
    <div className="grid">
      <h1 className="font-bold text-xl text-brand text-xl mb-8">
        Product page
      </h1>

      <div className="flex justify-end">
        <Button
          onPress={onEditPress}
          className="max-w-fit min-w-20 text-center"
        >
          Edit
        </Button>
      </div>

      <div className="text-left text-slate-8 justify-self-center w-2xl">
        <h5 className="text-brand text-4xl font-bold">{product?.name}</h5>

        <div className="mt-8">
          <div className="text-brand font-bold text-3xl italic">
            RM {product?.price}
          </div>

          <div className="bg-brand/85 text-white p-2 rounded w-fit h-fit">
            {product?.stock} item left
          </div>
        </div>

        <h5 className="text-lg mt-4 whitespace-pre-line">
          {product?.description}
        </h5>
      </div>

      <ProductFormModal />
    </div>
  );
}

export default ProductPage;
