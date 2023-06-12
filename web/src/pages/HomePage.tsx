import { useOverlayTriggerState } from "react-stately";
import Button from "../components/Button";
import { Dialog, Modal } from "../components/Modal";
import { useState } from "react";
import ProductForm from "../components/ProductForm";
import { ProductList } from "../components/Product";

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const state = useOverlayTriggerState({ isOpen });

  const onAddProductPress = () => {
    setIsOpen(true);
  };

  const onCancelProductForm = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-4">Homepage</h1>

      <Modal state={state}>
        <Dialog title="Add Product" className="p-4">
          <ProductForm onCancel={onCancelProductForm} />
        </Dialog>
      </Modal>

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
