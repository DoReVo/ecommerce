import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const qClient = useQueryClient();

  const { data: cartData } = useQuery(["cart"], async () =>
    ky.get("api/cart").json()
  );

  const total = cartData?.reduce(
    (prev, curr) => prev + curr?.amount * curr?.product?.price,
    0
  );

  const productIds = cartData?.map((entry) => entry?.id);

  const navigate = useNavigate();

  const checkoutMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/cart/checkout", { json: data }).json();
    },
    onSuccess: () => {
      qClient.invalidateQueries(["cart"]);
      navigate("/", {
        state: { shouldShowCheckoutSuccess: true },
      });
    },
  });

  const onCheckoutPress = () => {
    // Get all product Id
    checkoutMUT.mutate(productIds);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-brand font-bold text-2xl">Checkout</h1>

      {cartData?.map((entry) => (
        <div className="border py-2 px-4 w-fit my-4 rounded flex gap-x-4 w-full items-center justify-between">
          <div className="text-xl text-slate-7 font-bold">
            {entry?.product?.name}
          </div>

          <div className="flex gap-x-2 justify-center items-center">
            <div className="text-brand font-bold">
              RM {entry?.product?.price}
            </div>

            <div className="text-lg text-center text-slate-7">
              x {entry?.amount}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center font-bold text-xl text-slate-7 mt-8">
        <div>TOTAL</div>
        <div>RM {total}</div>
      </div>

      <div className="my-8">
        <label className="text-slate-6">Credit Card Number</label>
        <TextInput />

        <label className="text-slate-6">Credit Card Expiry</label>
        <TextInput />

        <label className="text-slate-6">Credit Card CC</label>
        <TextInput />
      </div>

      <Button
        className="w-full flex items-center gap-x-2 justify-center"
        onPress={onCheckoutPress}
      >
        <div>Pay</div>
      </Button>
    </div>
  );
}

export default CheckoutPage;
