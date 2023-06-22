import { PropsWithChildren, useRef, useState } from "react";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import { useAtom } from "jotai";
import { isEditingProductIDAtom } from "../atoms";
import { useFileUpload } from "react-use-file-upload/dist/lib/useFileUpload";
import { isEmpty } from "lodash-es";

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

  const { setFiles, fileNames, files, removeFile, createFormData } =
    useFileUpload();

  const createProductMUT = useMutation({
    async mutationFn(data) {
      if (!isEmpty(files)) {
        const uploadRes = await uploadFiles();

        const listOfIds = uploadRes?.map((entry) => entry?.id);

        data.images = listOfIds;
      }

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

  async function uploadFiles() {
    const formData = createFormData();
    const res = ky.post("api/products/images", { body: formData }).json();

    return res;
  }

  const onSubmitHandler = (data) => {
    if (mode === "CREATE") {
      // Upload files
      createProductMUT.mutate(data);
    } else editProductMUT.mutate(data);
  };

  const onCancelHandler = () => {
    setIsEditingID(null);
    form.reset();
    if (onCancel) onCancel();
  };

  const fileInputRef = useRef(null);

  const onPressChooseImage = () => {
    fileInputRef?.current?.click();
  };

  function createUrl(file) {
    return URL.createObjectURL(file);
  }

  const [imageIndex, setImageIndex] = useState(0);

  const onNextImage = () =>
    setImageIndex((state) =>
      state + 1 <= files.length - 1 ? state + 1 : state
    );
  const onPrevImage = () =>
    setImageIndex((state) => (state - 1 < 0 ? 0 : state - 1));

  const imageFileToDisplay = files?.at(imageIndex);

  function removeImage() {
    onPrevImage();
    removeFile(imageIndex);
  }

  return (
    <form className="max-w-md" onSubmit={form.handleSubmit(onSubmitHandler)}>
      {!isEmpty(files) ? (
        <div className="">
          <div className="flex justify-center items-center flex-col">
            <img
              className="aspect-video max-h-300px"
              src={createUrl(imageFileToDisplay)}
            />
            <div className="text-md my-2 flex gap-x-4 items-center justify-center">
              <Button
                className="!p-0 text-brand bg-inherit flex gap-x-2"
                onPress={removeImage}
              >
                <div className="text-slate-7">{imageFileToDisplay?.name}</div>

                <div className="i-carbon-close-outline"></div>
              </Button>
            </div>
          </div>

          <div className="flex gap-x-4 justify-center items-center my-4">
            <Button className="text-xs !p-1 bg-gray-4" onPress={onPrevImage}>
              <div className="i-carbon-chevron-left"></div>
            </Button>
            <Button className="text-xs !p-1 bg-gray-4" onPress={onNextImage}>
              <div className="i-carbon-chevron-right"></div>
            </Button>
          </div>
        </div>
      ) : null}
      <div className="flex justify-center items-center">
        <Button className="text-xs" onPress={onPressChooseImage}>
          Choose images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            setFiles(e, "a");
            setImageIndex(0);
            fileInputRef.current.value = null;
          }}
        />
      </div>

      <FormLabel>Name</FormLabel>
      <TextInput {...form.register("name")} />
      <FormLabel>Unit Price (RM)</FormLabel>
      <TextInput type="number" {...form.register("price")} />
      <FormLabel>Stock</FormLabel>
      <TextInput type="number" {...form.register("stock")} />
      <FormLabel>Description</FormLabel>
      <TextAreaInput {...form.register("description")} rows={10} />

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
