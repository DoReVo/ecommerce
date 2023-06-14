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
import { useUserQuery } from "../queries";
import TextAreaInput from "../components/TextAreaInput";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";

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

      <div className="text-left text-slate-8 justify-self-center w-2xl mt-8">
        <h5 className="text-brand text-4xl font-bold">{product?.name}</h5>

        <div className="mt-8">
          <div className="text-brand font-bold text-3xl italic">
            RM {product?.price}
          </div>

          <div className="bg-brand/85 text-white p-2 rounded w-fit h-fit">
            {product?.stock} item left
          </div>
        </div>

        <h5 className="text-lg mt-4 whitespace-pre-line">
          {product?.description}
        </h5>
      </div>

      <ProductFormModal />
      <ConfirmDeleteModal callback={deleteCallback} />

      <div className="text-xl text-brand font-bold mt-12">Feedbacks</div>

      <form onSubmit={feedbackForm.handleSubmit(onSubmitFeedbackForm)}>
        <TextAreaInput
          rows={5}
          placeholder="Write what you feel about the product"
          {...feedbackForm.register("text")}
        />

        <Button className="mt-4" type="submit">
          Submit Feedback
        </Button>
      </form>
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
