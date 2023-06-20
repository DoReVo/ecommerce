import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import Button from "../components/Button";
import { useState } from "react";
import { useAddToCartQuery } from "../queries";

function CartPage() {
  const [amount, setAmount] = useState(0);

  const qClient = useQueryClient();

  const onPlus = (id, amount) => {
    addToCartMUT.mutate({ productId: id, amount });
  };
  const onMinus = (id, amount) => {
    addToCartMUT.mutate({ productId: id, amount });
  };

  const cartDeleteMUT = useMutation({
    mutationFn: async (data) =>
      await ky.delete("api/cart", { json: data }).json(),
    onSuccess: () => {
      qClient.invalidateQueries(["cart"]);
    },
  });

  const onDeletePress = (productId) => {
    cartDeleteMUT.mutate({ productId });
  };

  const addToCartMUT = useAddToCartQuery({});

  const { data: cartData } = useQuery(["cart"], async () =>
    ky.get("api/cart").json()
  );

  const total = cartData?.reduce(
    (prev, curr) => prev + curr?.amount * curr?.product?.price,
    0
  );

  const productIds = cartData?.map((entry) => entry?.id);

  const checkoutMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/cart/checkout", { json: data }).json();
    },
  });

  const onCheckoutPress = () => {
    // Get all product Id
    checkoutMUT.mutate(productIds);
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-brand font-3xl font-bold">Your shopping cart</h1>

      {cartData?.map((entry) => (
        <div className="border py-2 px-4 w-fit my-4 rounded flex gap-x-4 w-full items-center justify-between">
          <div className="text-xl text-slate-7 font-bold">
            {entry?.product?.name}
          </div>

          <div className="flex gap-x-2 justify-center items-center">
            <div className="text-brand font-bold">
              RM {entry?.product?.price}
            </div>

            <Button
              onPress={() => onMinus(entry?.product?.id, entry?.amount - 1)}
              className="w-fit h-fit p-1! rounded-full bg-slate-5"
            >
              <div className="i-carbon-subtract"></div>
            </Button>

            <div className="">
              <div className="text-lg text-center text-slate-7">
                {entry?.amount}
              </div>
            </div>

            <Button
              onPress={() => onPlus(entry?.product?.id, entry?.amount + 1)}
              className="w-fit h-fit p-1! rounded-full bg-slate-5"
            >
              <div className="i-carbon-add"></div>
            </Button>

            <Button
              className="bg-red-5 text-white"
              onPress={() => onDeletePress(entry?.product?.id)}
            >
              <div className="i-carbon-trash-can"></div>
            </Button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center font-bold text-3xl text-slate-7 mt-8">
        <div>Total</div>
        <div>RM {total}</div>
      </div>

      <Button
        className="w-full flex items-center gap-x-2 justify-center"
        onPress={onCheckoutPress}
      >
        <div className="i-carbon-shopping-cart" />
        <div>Checkout</div>
      </Button>
    </div>
  );
}

export default CartPage;
