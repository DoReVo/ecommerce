import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import Button from "../components/Button";
import { useState } from "react";

function CartPage() {
  const [amount, setAmount] = useState(0);

  const onPlus = () => {
    setAmount((cur) => cur + 1);
  };
  const onMinus = () => {
    setAmount((cur) => (cur <= 0 ? 0 : cur - 1));
  };

  const { data } = useQuery(["cart"], async () => ky.get("api/cart").json());
  return (
    <div>
      <h1 className="text-brand font-3xl font-bold">Your shopping cart</h1>

      {data?.map((entry) => (
        <div className="shadow p-2 w-fit rounded flex gap-x-4">
          <div className="text-xl text-slate-7 font-bold">
            {entry?.product?.name}
          </div>

          <div className="flex gap-x-2 justify-center items-center">
            <Button onPress={onMinus} className="w-fit h-fit p-1! rounded-full">
              <div className="i-carbon-subtract"></div>
            </Button>

            <div className="">
              <div className="text-lg text-center text-slate-7">{entry?.amount}</div>
            </div>

            <Button onPress={onPlus} className="w-fit h-fit p-1! rounded-full">
              <div className="i-carbon-add"></div>
            </Button>
          </div>

          <Button className="bg-red-5">Remove</Button>
        </div>
      ))}
    </div>
  );
}

export default CartPage;
