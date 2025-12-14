import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodBookingOrder, FoodOrder } from "@/api/types";
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
import FoodBookingCard from "./_components/FoodBookingOrder";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
const status_list = [
  "delivered",
  "cancelled",
  "preparing",
  "confirmed",
  "on-the-way",
] as const;

export default function index() {
  const [status, setStatus] =
    useState<(typeof status_list)[number]>("confirmed");
  const paginate = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse<{ foodOrders: FoodBookingOrder[] }>>({
    queryKey: ["food-orders", status, paginate.page, searchProps.search],
    queryFn: async () => {
      const params = {
        status: status,
        page: paginate.page,
        search: searchProps.search,
      };
      let resp = await apiClient.get("admins/foods/orders", {
        params: remove_nulls(params),
      });
      return resp.data;
    },
  });

  return (
    <>
      <SimpleTitle title="Food Orders" />
      <div className="flex justify-end mb-4">
        <SimpleSearch props={searchProps} />
      </div>
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
              <div className="grid  masonry grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2">
                {payload.map((item) => (
                  <>
                    <FoodBookingCard food={item} refetch={query.refetch} />
                  </>
                ))}
              </div>
              {/*<CustomTable
                data={payload}
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
              />*/}
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
