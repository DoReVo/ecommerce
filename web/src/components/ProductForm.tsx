import { PropsWithChildren } from "react";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import { useAtom } from "jotai";
import { isEditingProductIDAtom } from "../atoms";

function FormLabel(props: PropsWithChildren) {
  const { children } = props;
  return <label className="text-brand font-bold text-sm">{children}</label>;
}

interface ProductFormProps {
  onCancel?: () => void;
}

function ProductForm(props: ProductFormProps) {
  const [isEditingID, setIsEditingID] = useAtom(isEditingProductIDAtom);

  const mode: "CREATE" | "EDIT" = isEditingID ? "EDIT" : "CREATE";

  const { data: productData, isLoading: isLoadingProductData } = useQuery({
    queryKey: ["product", isEditingID],
    queryFn: async () => await ky.get(`api/products/${isEditingID}`).json(),
    enabled: mode === "EDIT",
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { onCancel } = props;
  const form = useForm({ values: productData });

  const qClient = useQueryClient();

  const createProductMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/products", { json: data }).json();
    },
    onSuccess(data) {
      qClient.invalidateQueries(["product-list"]);
      //   setServerMsg({ type: "info", message: JSON.stringify(data) });
      //   router("/login");
      onCancelHandler();
    },
  });

  const editProductMUT = useMutation({
    async mutationFn(data) {
      return await ky.put(`api/products/${isEditingID}`, { json: data }).json();
    },
    onSuccess(data) {
      qClient.invalidateQueries(["product-list"]);
      qClient.invalidateQueries(["product", isEditingID]);
      onCancelHandler();
    },
  });

  const onSubmitHandler = (data) => {
    if (mode === "CREATE") createProductMUT.mutate(data);
    else editProductMUT.mutate(data);
  };

  const onCancelHandler = () => {
    setIsEditingID(null);
    form.reset();
    if (onCancel) onCancel();
  };

  return (
    <form className="max-w-md" onSubmit={form.handleSubmit(onSubmitHandler)}>
      <FormLabel>Name</FormLabel>
      <TextInput {...form.register("name")} />
      <FormLabel>Description</FormLabel>
      <TextAreaInput {...form.register("description")} />
      <FormLabel>Unit Price (RM)</FormLabel>
      <TextInput type="number" {...form.register("price")} />
      <FormLabel>Initial Stock</FormLabel>
      <TextInput type="number" {...form.register("stock")} />

      <div className="flex gap-x-2 flex-row-reverse mt-8">
        <Button className="min-w-20" type="submit">
          Save
        </Button>
        <Button className="min-w-20 bg-red-5" onPress={onCancelHandler}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
