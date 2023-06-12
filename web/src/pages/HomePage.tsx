import Button from "../components/Button";
import { ProductList } from "../components/Product";
import { useAtom } from "jotai";
import { isOpenProductFormAtom } from "../atoms";
import ProductFormModal from "../components/ProductFormModal";

function HomePage() {
  const [, setIsOpen] = useAtom(isOpenProductFormAtom);

  const onAddProductPress = () => {
    setIsOpen(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-4">Homepage</h1>

      <ProductFormModal />

      <div className="flex flex-row-reverse">
        <Button className="text-xs" onPress={onAddProductPress}>
          <div className="i-carbon-add"></div>
          Add Products
        </Button>
      </div>

      <h3 className="text-3xl font-bold text-slate-6">Products</h3>
      <ProductList />
    </div>
  );
}

export default HomePage;
