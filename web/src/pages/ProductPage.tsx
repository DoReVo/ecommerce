import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAtom } from "jotai";
import {
  deleteConfirmationModalDataAtom,
  isEditingProductIDAtom,
  isOpenProductFormAtom,
} from "../atoms";
import ProductFormModal from "../components/ProductFormModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useAddToCartQuery, useUserQuery } from "../queries";
import TextAreaInput from "../components/TextAreaInput";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import TextInput from "../components/TextInput";
import { useState } from "react";
import { isEmpty } from "lodash-es";

function ProductPage() {
  const [isEditingID, setIsEditingID] = useAtom(isEditingProductIDAtom);
  const [deleteData, setDeleteData] = useAtom(deleteConfirmationModalDataAtom);

  const [, setIsOpen] = useAtom(isOpenProductFormAtom);
  const { id } = useParams();

  const navigate = useNavigate();

  const qClient = useQueryClient();

  const { data: userData } = useUserQuery();

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => await ky.get(`api/products/${id}`).json(),
  });

  const onEditPress = () => {
    setIsEditingID(id as any);
    setIsOpen(true);
  };

  const onDeletePress = () => {
    setDeleteData({
      isOpen: true,
      data: { id: id, resourcePath: "api/products" },
    });
  };

  const deleteCallback = () => {
    qClient.invalidateQueries(["product-list"]);
    qClient.removeQueries(["product", id]);
    navigate("/");
  };

  const feedbackForm = useForm();

  const createFeedbackMUT = useMutation({
    mutationFn: async (data) => {
      return await ky
        .post(`api/products/${id}/feedbacks`, { json: data })
        .json();
    },
    onSuccess: () => {
      qClient.invalidateQueries(["product", id, "feedbacks"]);
      feedbackForm.reset();
    },
  });

  const onSubmitFeedbackForm = (data) => {
    createFeedbackMUT.mutate(data);
  };

  const { data: feedbackData } = useQuery({
    queryKey: ["product", id, "feedbacks"],
    queryFn: async () => await ky.get(`api/products/${id}/feedbacks`).json(),
  });

  const [amount, setAmount] = useState(1);

  const onPlus = () => {
    setAmount((cur) => cur + 1);
  };
  const onMinus = () => {
    setAmount((cur) => (cur <= 0 ? 0 : cur - 1));
  };

  const addToCartMUT = useAddToCartQuery({
    successCb: () => {
      setAmount(0);
    },
  });

  const onAddToCartPress = () => {
    addToCartMUT.mutate({
      productId: product?.id,
      amount,
    });
  };

  const [imageIndex, setImageIndex] = useState(0);

  const files = product?.productImages;

  const onNextImage = () =>
    setImageIndex((state) =>
      state + 1 <= files?.length - 1 ? state + 1 : state
    );
  const onPrevImage = () =>
    setImageIndex((state) => (state - 1 < 0 ? 0 : state - 1));

  const imageToDisplay = files?.at(imageIndex);

  return (
    <div className="grid">
      <h1 className="font-bold text-xl text-brand text-xl mb-8">
        Product page
      </h1>

      {userData?.isAdmin ? (
        <>
          <div className="text-right text-red-5">Administratives action</div>
          <div className="flex justify-start gap-x-2 border rounded border-red-5 p-4 flex-row-reverse">
            <Button
              onPress={onEditPress}
              className="max-w-fit min-w-20 text-center"
            >
              Edit
            </Button>
            <Button
              onPress={onDeletePress}
              className="max-w-fit min-w-20 text-center bg-red-5"
            >
              Delete
            </Button>
          </div>
        </>
      ) : null}

      {!isEmpty(product?.productImages) ? (
        <div className="flex justify-center items-center my-4 flex-col">
          <img
            className="aspect-video max-h-300px"
            src={`${import.meta.env.VITE_API_URL}/api/images/product-image/${
              imageToDisplay?.id
            }/${imageToDisplay?.fileName}`}
          ></img>
          <div className="text-slate-7">{imageToDisplay?.fileName}</div>

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

      <div className="text-slate-8 mt-8 font-mono min-h-md">
        <div className="flex justify-between">
          <h5 className="text-4xl font-bold">{product?.name}</h5>

          <div className="">
            <div className="flex gap-x-2 justify-center">
              <div className="bg-slate-6 text-white p-2 rounded w-fit h-fit">
                {product?.stock} item left
              </div>

              {userData?.id ? (
                <Button className="h-fit w-fit" onPress={onAddToCartPress}>
                  Add to cart
                </Button>
              ) : null}
            </div>

            {userData?.id ? (
              <>
                <div className="mt-2 flex gap-x-2 justify-end items-center">
                  <Button
                    onPress={onMinus}
                    className="w-fit h-fit p-1! rounded-full"
                  >
                    <div className="i-carbon-subtract"></div>
                  </Button>

                  <div className="w-30">
                    <TextInput
                      className="text-center"
                      type="number"
                      value={amount}
                      disabled
                    />
                  </div>

                  <Button
                    onPress={onPlus}
                    className="w-fit h-fit p-1! rounded-full"
                  >
                    <div className="i-carbon-add"></div>
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          <div className="font-bold text-3xl italic">RM {product?.price}</div>
        </div>

        <h5 className="text-lg mt-4 whitespace-pre-line">
          {product?.description}
        </h5>
      </div>

      <ProductFormModal />
      <ConfirmDeleteModal callback={deleteCallback} />

      {userData?.id ? (
        <>
          <div className="text-xl text-brand font-bold mt-20 border-t py-8">
            Feedbacks
          </div>
          <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedbackForm)}>
            <TextAreaInput
              rows={5}
              placeholder="Write what you feel about the product"
              {...feedbackForm.register("text")}
            />

            <Button className="mt-4 w-full" type="submit">
              Submit Feedback
            </Button>
          </form>
        </>
      ) : null}

      <div className="text-lg text-brand font-bold mt-12 italic">
        What people say
      </div>

      {feedbackData?.map((entry) => (
        <div className="shadow-sm p-4 rounded mb-2 border">
          <div className="text-slate-7 text-lg font-bold tracking-widest">
            {entry?.user?.name}
          </div>
          <div className="mt-4 whitespace-pre-line">{entry?.text}</div>
          <div className="mt-8">
            {DateTime.fromISO(entry?.createdAt).toRelative()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductPage;
