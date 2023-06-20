import { useQuery } from "@tanstack/react-query";
import { ky } from "../utility";

function SalesDashboardPage() {
  const { data: summaryData } = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      return await ky.get("api/summary").json();
    },
  });
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-brand font-bold text-2xl">Sales Dashboard</h1>
    </div>
  );
}

export default SalesDashboardPage;
