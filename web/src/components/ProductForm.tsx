import { PropsWithChildren } from "react";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ky } from "../utility";

function FormLabel(props: PropsWithChildren) {
  const { children } = props;
  return <label className="text-brand font-bold text-sm">{children}</label>;
}

interface ProductFormProps {
  onCancel?: () => void;
}

function ProductForm(props: ProductFormProps) {
  const { onCancel } = props;
  const form = useForm();

  const createProductMUT = useMutation({
    async mutationFn(data) {
      return await ky.post("api/products", { json: data }).json();
    },
    onSuccess(data) {
      //   setServerMsg({ type: "info", message: JSON.stringify(data) });
      //   router("/login");
      onCancelHandler();
    },
  });

  const onSubmitHandler = (data) => {
    console.log("Submitted", data);

    createProductMUT.mutate(data);
  };

  const onCancelHandler = () => {
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
