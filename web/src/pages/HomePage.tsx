import Button from "../components/Button";
import { ProductList } from "../components/Product";
import { useAtom } from "jotai";
import { isOpenProductFormAtom } from "../atoms";
import ProductFormModal from "../components/ProductFormModal";
import { useUserQuery } from "../queries";

function HomePage() {
  const { data } = useUserQuery();
  const [, setIsOpen] = useAtom(isOpenProductFormAtom);

  const onAddProductPress = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand text-center">Homepage</h1>

      <ProductFormModal />

      {data?.isAdmin ? (
        <>
          <div className="text-right text-red-5">Administratives action</div>
          <div className="flex justify-start gap-x-2 border rounded border-red-5 p-4 flex-row-reverse">
            <Button className="text-xs" onPress={onAddProductPress}>
              <div className="i-carbon-add"></div>
              Add Products
            </Button>
          </div>
        </>
      ) : null}

      <h3 className="text-4xl font-bold text-brand my-8">Products</h3>
      <ProductList />
    </div>
  );
}

export default HomePage;
