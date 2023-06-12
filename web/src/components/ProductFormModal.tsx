import { useAtom } from "jotai";
import { Dialog, Modal } from "./Modal";
import ProductForm from "./ProductForm";
import { useOverlayTriggerState } from "react-stately";
import { isOpenProductFormAtom } from "../atoms";

function ProductFormModal() {
  const [isOpen, setIsOpen] = useAtom(isOpenProductFormAtom);
  const state = useOverlayTriggerState({ isOpen });

  const onCancelProductForm = () => {
    setIsOpen(false);
  };

  return (
    <Modal state={state}>
      <Dialog title="Add Product" className="p-4">
        <ProductForm onCancel={onCancelProductForm} />
      </Dialog>
    </Modal>
  );
}

export default ProductFormModal;
