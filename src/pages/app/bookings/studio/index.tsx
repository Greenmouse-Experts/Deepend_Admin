import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { StudioBooking, StudioBookings } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
type selectedType = "ongoing" | "completed" | "cancelled";
export default function index() {
  const [selected, setSelected] = useState<selectedType>("ongoing");
  const query = useSuspenseQuery<ApiResponse<any[]>>({
    queryKey: ["studio-bookings", selected],
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
    <SuspensePageLayout query={query as any} title={"Studio Booknigs"}>
      {(data: ApiResponse<StudioBookings[]>) => {
        return (
          <div className="bg-base-300 p-4 rounded-md">
            <ul className="menu bg-base-200 w-full rounded-box">
              {data.payload.map((booking: StudioBookings) => (
                <li key={booking.id}>
                  <a>
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {booking.rentalStartDate} - {booking.rentalEndDate}
                      </span>
                      <span className="text-sm">User ID: {booking.userId}</span>
                      <span className="text-sm">
                        Equipment: {booking.equipmentName}
                      </span>
                      <span className="text-sm">Status: {booking.status}</span>
                      <span className="text-sm">
                        Total Price: {booking.totalPrice} {booking.currency}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    </SuspensePageLayout>
  );
}
