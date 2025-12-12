import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { HotelBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
// import SimpleHeader from "@/components/SimpleHeader";
// import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import CustomTable from "@/components/tables/CustomTable";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import HotelBookingCard from "./_components";
const status_list = ["confirmed", "cancelled", "completed"];
export default function index() {
  const [status, setStatus] =
    useState<(typeof status_list)[number]>("confirmed");
  const props = usePagination();
  const query = useQuery<
    ApiResponse<{
      hotelBookings: HotelBooking[];
    }>
  >({
    queryKey: ["hotel-bookings", status],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/hotels/bookings`, {
        params: {
          status,
          page: props.page,
          limit: 10,
        },
      });
      return resp.data;
    },
  });

  return (
    <div>
      <SimpleTitle title={"Hotel Bookings"} />
      <div className="tabs">
        {status_list.map((stat) => (
          <a
            key={stat}
            className={`tab tab-lg tab-lifted capitalize ${
              status === stat ? "tab-active" : ""
            }`}
            onClick={() => setStatus(stat)}
          >
            {stat}
          </a>
        ))}
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.hotelBookings;
          return (
            <>
              <CustomTable
                data={data.payload.hotelBookings}
                columns={[
                  { key: "id", label: "ID" },
                  { key: "hotelName", label: "Hotel Name" },
                  { key: "hotelRoomName", label: "Room Name" },
                  { key: "checkInDate", label: "Check-in Date" },
                  { key: "checkOutDate", label: "Check-out Date" },
                  { key: "totalPrice", label: "Total Price" },
                  { key: "currency", label: "Currency" },
                  { key: "status", label: "Status" },
                ]}
              />
            </>
          );
        }}
      </SuspensePageLayout>
    </div>
  );
}
