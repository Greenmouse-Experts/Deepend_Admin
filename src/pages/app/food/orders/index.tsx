import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodOrder } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import CustomTable from "@/components/tables/CustomTable";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const status_list = [
  "delivered",
  "cancelled",
  "preparing",
  "confirmed",
] as const;
export default function index() {
  const [status, setStatus] =
    useState<(typeof status_list)[number]>("delivered");
  const paginate = usePagination();
  const query = useQuery<ApiResponse<FoodOrder[]>>({
    queryKey: ["food-orders", status],
    queryFn: async () => {
      let resp = await apiClient.get("admins/foods/orders", {
        params: {
          status: status,
          // page: paginate.page,
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
        {(data: ApiResponse<FoodOrder[]>) => {
          const payload = data.payload;
          return (
            <>
              <CustomTable
                data={payload}
                columns={[
                  { key: "orderId", label: "Order ID" },
                  { key: "foodName", label: "Food Name" },
                  { key: "quantity", label: "Quantity" },
                  { key: "foodPrice", label: "Price" },
                  { key: "totalPrice", label: "Total Price" },
                  { key: "deliveryType", label: "Delivery Type" },
                  { key: "status", label: "Status" },
                ]}
              />
              <EmptyList list={payload} />
              <div className="mt-4">
                <SimplePaginator {...paginate} />
              </div>
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}
