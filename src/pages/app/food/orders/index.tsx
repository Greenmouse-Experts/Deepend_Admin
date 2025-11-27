import apiClient, { type ApiResponse } from "@/api/apiClient";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
type selectedType = "delivered" | "cancelled" | "preparing";
const status_list = [
  "delivered",
  "cancelled",
  "preparing",
] satisfies selectedType[];
export default function index() {
  const [status, setStatus] = useState<selectedType>("delivered");

  const query = useQuery<ApiResponse>({
    queryKey: ["food-orders", status],
    queryFn: async () => {
      let resp = await apiClient.get("admins/foods/orders", {
        params: {
          status: status,
        },
      });
      return resp.data;
    },
  });
  return (
    <>
      <SimpleTitle title="Food Orders" />
      <div className="tabs bg-base-100 capitalize">
        {status_list.map((item) => (
          <a
            key={item}
            className={`tab tab-lg tab-lifted ${
              item === status ? "tab-active" : ""
            }`}
            onClick={() => setStatus(item)}
          >
            {item}
          </a>
        ))}
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data: ApiResponse<any[]>) => {
          const payload = data.payload;
          return (
            <>
              <ul className="menu w-full">
                {payload.map((item) => (
                  <li key={item.id}>{JSON.stringify(item)}</li>
                ))}
              </ul>
              <EmptyList list={payload} />
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}
