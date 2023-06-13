import { useAtom } from "jotai";
import { deleteConfirmationModalDataAtom } from "../atoms";
import { useOverlayTriggerState } from "react-stately";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ky } from "../utility";
import { Dialog, Modal } from "./Modal";
import Button from "./Button";

function ConfirmDeleteModal(props: { callback?: () => void }) {
  const [data, setData] = useAtom(deleteConfirmationModalDataAtom);
  const state = useOverlayTriggerState({ isOpen: data?.isOpen });

  const deleteResourceMUT = useMutation(
    async () =>
      await ky.delete(`${data?.data?.resourcePath}/${data?.data?.id}`).json(),
    {
      onSuccess: () => {
        resetData();
        if (props.callback) props.callback();
      },
    }
  );

  const onClickConfirm = () => {
    deleteResourceMUT.mutate();
  };

  const onClickCancel = () => {
    resetData();
  };

  function resetData() {
    setData({ isOpen: false, data: { id: "", resourcePath: "" } });
  }

  return (
    <Modal state={state}>
      <Dialog title="Delete Resource?" className="px-8 py-12 rounded min-w-sm">
        <div>Resource will be deleted</div>
        <div className="mt-8 flex gap-x-2 flex-row-reverse">
          <Button className="bg-red-500" onPress={onClickConfirm}>
            Confirm
          </Button>
          <Button onPress={onClickCancel}>Cancel</Button>
        </div>
      </Dialog>
    </Modal>
  );
}
export default ConfirmDeleteModal;
