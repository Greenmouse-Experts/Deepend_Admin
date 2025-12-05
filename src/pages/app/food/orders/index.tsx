import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodOrder } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import CustomTable from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/auth";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
const status_list = [
  "delivered",
  "cancelled",
  "preparing",
  "confirmed",
  "on-the-way",
] as const;

const allowed_Status_update = (
  currentStatus: (typeof status_list)[number],
): (typeof status_list)[number][] => {
  switch (currentStatus) {
    case "confirmed":
      return ["preparing", "cancelled", "on-the-way"];
    case "preparing":
      return ["delivered", "cancelled"];
    case "delivered":
    case "cancelled":
      return []; // No further updates allowed for delivered or cancelled orders
    default:
      return [];
  }
};
export default function index() {
  const [status, setStatus] =
    useState<(typeof status_list)[number]>("delivered");
  const paginate = usePagination();
  const query = useQuery<ApiResponse<{ foodOrders: FoodOrder[] }>>({
    queryKey: ["food-orders", status, paginate.page],
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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (fn: any) => fn(),
    onSuccess: () => {
      query.refetch();
    },
  });
  const update_status = async (
    id: string,
    newStatus: (typeof status_list)[number],
  ) => {
    let resp = await apiClient.patch(`admins/orders/foods/${id}/status`, {
      status: newStatus,
    });
    return resp.data;
  };

  const call_ = async (fn: () => Promise<any>) => {
    toast.promise(
      mutateAsync(() => fn()),
      {
        loading: "loading",
        error: extract_message,
        success: extract_message,
      },
    );
  };
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
        {(data) => {
          const payload = data.payload.foodOrders;
          return (
            <>
              <CustomTable
                data={[]}
                columns={[
                  { key: "orderId", label: "Order ID" },
                  { key: "foodName", label: "Food Name" },
                  { key: "quantity", label: "Quantity" },
                  { key: "foodPrice", label: "Price" },
                  { key: "totalPrice", label: "Total Price" },
                  { key: "deliveryType", label: "Delivery Type" },
                  {
                    key: "status",
                    label: "Status",
                    render: (value) => {
                      let colorClass = "";
                      switch (value) {
                        case "delivered":
                          colorClass = "text-success";
                          break;
                        case "cancelled":
                          colorClass = "text-error";
                          break;
                        case "preparing":
                          colorClass = "text-warning";
                          break;
                        case "confirmed":
                          colorClass = "text-info";
                          break;
                        default:
                          colorClass = "text-base-content";
                          break;
                      }
                      return <span className={colorClass}>{value}</span>;
                    },
                  },
                ]}
                actions={status_list
                  .filter((s) => allowed_Status_update(status).includes(s))
                  .map((s) => ({
                    key: s,
                    label: `Mark as ${s}`,
                    action: (item: FoodOrder) => {
                      call_(() => update_status(item.id, s));
                    },
                  }))}
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
