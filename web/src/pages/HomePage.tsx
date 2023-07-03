import Button from "../components/Button";
import { ProductList } from "../components/Product";
import { useAtom } from "jotai";
import { isOpenProductFormAtom, searchTermAtom } from "../atoms";
import ProductFormModal from "../components/ProductFormModal";
import { useUserQuery } from "../queries";
import TextInput from "../components/TextInput";
import { useLocation, useNavigate } from "react-router-dom";
import { useOverlayTriggerState } from "react-stately";
import { Dialog, Modal } from "../components/Modal";

function CheckoutSuccessModal() {
  const { state: routeState } = useLocation();
  const navigate = useNavigate();

  const state = useOverlayTriggerState({
    defaultOpen: routeState?.shouldShowCheckoutSuccess,
  });

  function close() {
    navigate("/", { state: null });
    state.close();
  }

  if (!state.isOpen) return null;

  return (
    <Modal state={state}>
      <Dialog
        title="Checkout Successful"
        className="px-8 py-8 rounded min-w-sm"
      >
        <div className="w-xs mt-4">
          Thank you for purchasing with us, we will ship your order soon.
        </div>
        <div className="mt-8 flex gap-x-2 flex-row-reverse">
          <Button className="w-24" onPress={close}>
            Ok
          </Button>
        </div>
      </Dialog>
    </Modal>
  );
}

function HomePage() {
  const { data } = useUserQuery();
  const [, setIsOpen] = useAtom(isOpenProductFormAtom);

  const onAddProductPress = () => {
    setIsOpen(true);
  };

  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);

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

      <div className="my-4">
        <div className="text-slate-7 font-mono">Search products</div>

        <TextInput
          className="border-brand"
          onChange={(e) => setSearchTerm(e?.target?.value)}
          value={searchTerm}
        />
      </div>

      <h3 className="text-4xl font-bold text-brand my-8">Products</h3>
      <ProductList />

      <CheckoutSuccessModal />
    </div>
  );
}

export default HomePage;
