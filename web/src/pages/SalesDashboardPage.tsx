import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";
import { DateTime } from "luxon";
import { useState } from "react";
import { usePress } from "react-aria";
import { useUserQuery } from "../queries";

function PurchaseDataCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  const { pressProps } = usePress({
    allowTextSelectionOnPress: true,
    onPress() {
      setExpanded((state) => !state);
    },
  });

  return (
    <div
      className="shadow-sm px-4 py-2 rounded border cursor-pointer text-slate-7"
      {...pressProps}
    >
      <div className="flex gap-x-4 items-center justify-between">
        <div className="text-xl">{data?.user?.name}</div>
        <div className="flex gap-x-4 items-center">
          <div className="font-bold">RM {data?.amount}</div>
          <div>{DateTime.fromISO(data?.createdAt).toRelative()}</div>
        </div>
      </div>

      {expanded ? (
        <div>
          <div className="font-bold mt-4 mb-2 border-b">Shipping Address</div>
          <div className="whitespace-pre-line text-sm">{data?.address}</div>
          <div className="font-bold mt-4 mb-2 border-b">Items</div>
          {data?.data?.map((entry) => (
            <div className="flex gap-x-4">
              <div className="grow">{entry?.product?.name}</div>
              <div>RM {entry?.product?.price}</div>
              <div>X {entry?.amount}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SalesDashboardPage() {
  const { data: userData } = useUserQuery();

  const isAdmin = userData?.isAdmin;

  const { data: purchaseHistoryData } = useQuery({
    queryKey: ["purchase-history"],
    queryFn: async () => {
      return await ky.get("api/summary").json();
    },
    select(data) {
      if (isAdmin) return data;

      // Filter only for user
      const newData = data?.checkoutData?.filter(
        (entry) => entry?.userId === userData?.id
      );

      return { ...data, checkoutData: newData };
    },
  });

  return (
    <div className="max-w-xl mx-auto">
      {isAdmin ? (
        <>
          <h1 className="text-brand font-bold text-2xl mb-4">
            Sales Dashboard
          </h1>
          <h3 className="text-brand text-xl font-bold mb-4 py-2">
            Total Profit
          </h3>
          <div className="flex justify-center items-center my-8">
            <div className="font-bold text-6xl text-slate-7 text-center m-4 w-fit p-4 border-b-4 border-brand-light">
              RM {purchaseHistoryData?.total}
            </div>
          </div>
        </>
      ) : null}

      <h3 className="text-brand text-xl font-bold mb-4 py-2">
        Customer Purchase History
      </h3>

      <div className="flex flex-col gap-y-2">
        {purchaseHistoryData?.checkoutData?.map((entry) => (
          <PurchaseDataCard key={entry?.id} data={entry} />
        ))}
      </div>
    </div>
  );
}

export default SalesDashboardPage;
