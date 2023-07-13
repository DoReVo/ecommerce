import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TextAreaInput from "../components/TextAreaInput";
import { Controller, FormProvider, useForm } from "react-hook-form";

function CheckoutPage() {
  const qClient = useQueryClient();

  const { data: cartData } = useQuery(["cart"], async () =>
    ky.get("api/cart").json()
  );

  const total = cartData?.reduce(
    (prev, curr) => prev + curr?.amount * curr?.product?.price,
    0
  );

  const [addr, setAddr] = useState("");

  const productIds = cartData?.map((entry) => entry?.id);

  console.log("prod", productIds);

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

  const formMethods = useForm();

  const onSubmitHandler = (data: any) => {
    checkoutMUT.mutate({ address: data?.address });
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-brand font-bold text-2xl">Checkout</h1>

      {cartData?.map((entry) => (
        <div
          key={entry?.productId}
          className="border py-2 px-4 w-fit my-4 rounded flex gap-x-4 w-full items-center justify-between"
        >
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
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmitHandler)}>
            <label className="text-slate-6">Credit Card Number</label>
            <Controller
              name="ccNumber"
              rules={{ required: "Field is required" }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput {...field} />
                  <div className="text-red-5 text-sm">
                    {fieldState?.error?.message ?? null}
                  </div>
                </>
              )}
            />

            <label className="text-slate-6">Credit Card Expiry</label>
            <Controller
              name="ccExpiry"
              rules={{ required: "Field is required" }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput {...field} />
                  <div className="text-red-5 text-sm">
                    {fieldState?.error?.message ?? null}
                  </div>
                </>
              )}
            />

            <label className="text-slate-6">Credit Card CC</label>
            <Controller
              name="ccCC"
              rules={{ required: "Field is required" }}
              render={({ field, fieldState }) => (
                <>
                  <TextInput {...field} />
                  <div className="text-red-5 text-sm">
                    {fieldState?.error?.message ?? null}
                  </div>
                </>
              )}
            />

            <label className="text-slate-6">Shipping Address</label>
            <Controller
              name="address"
              rules={{ required: "Field is required" }}
              render={({ field, fieldState }) => (
                <>
                  <TextAreaInput rows={5} {...field} />
                  <div className="text-red-5 text-sm">
                    {fieldState?.error?.message ?? null}
                  </div>
                </>
              )}
            />

            <Button
              className="mt-4 w-full flex items-center gap-x-2 justify-center"
              type="submit"
            >
              <div>Pay</div>
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default CheckoutPage;
