import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { EquipmentBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
type selectedType = "ongoing" | "completed" | "cancelled";
const equipment_params: selectedType[] = ["ongoing", "completed", "cancelled"];
export default function index() {
  const [selected, setSelected] = useState<selectedType>("ongoing");
  const query = useQuery<ApiResponse<any>>({
    queryKey: ["equipments-bookings", selected],
    queryFn: async () => {
      let resp = await apiClient.get("admins/equipments/bookings", {
        params: {
          status: selected,
        },
      });
      return resp.data;
    },
  });

  return (
    <>
      <SimpleTitle title="Equipment Bookings" />
      <div className="tabs bg-base-100">
        {equipment_params.map((item) => (
          <span
            key={item}
            className={`capitalize tab ${item === selected ? "tab-active" : ""}`}
            onClick={() => setSelected(item)}
          >
            {item}
          </span>
        ))}
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(resp: ApiResponse<EquipmentBooking[]>) => {
          const data = resp.payload;
          return (
            <>
              <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,auto))]">
                {data.map((item) => {
                  let statusBadgeClass = "";
                  switch (item.status.toLowerCase()) {
                    case "ongoing":
                      statusBadgeClass = "badge-info";
                      break;
                    case "completed":
                      statusBadgeClass = "badge-success";
                      break;
                    case "cancelled":
                      statusBadgeClass = "badge-error";
                      break;
                    default:
                      statusBadgeClass = "badge-neutral";
                  }

                  return (
                    <div
                      key={item.id}
                      className="card w-full bg-base-100 shadow-xl border border-base-200"
                    >
                      <figure className="aspect-video">
                        <img
                          src={
                            item.equipmentImageUrl ||
                            "https://picsum.photos/400/200"
                          } // Fallback image
                          alt={item.equipmentName}
                          className="object-cover w-full h-full"
                        />
                      </figure>
                      <div className="card-body p-4">
                        <h2 className="card-title text-lg mb-2 flex flex-wrap items-center gap-2">
                          {item.equipmentName}
                          <div
                            className={`badge ${statusBadgeClass} text-xs font-semibold uppercase`}
                          >
                            {item.status}
                          </div>
                        </h2>
                        <p className="text-sm text-base-content/80 mb-2">
                          <strong>Address:</strong> {item.address}
                        </p>
                        <div className="flex flex-col gap-1 text-sm">
                          <p>
                            <strong>Rental Period:</strong>{" "}
                            {item.rentalStartDate} to {item.rentalEndDate}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Price per day:</strong> {item.currency}{" "}
                            {item.rentalPricePerDay}
                          </p>
                          <p>
                            <strong>Total Price:</strong> {item.currency}{" "}
                            {item.totalPrice}
                          </p>
                        </div>
                        <div className="card-actions justify-end mt-4">
                          <button className="btn btn-sm btn-outline">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <EmptyList list={data} />
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}

const Content = () => {};
