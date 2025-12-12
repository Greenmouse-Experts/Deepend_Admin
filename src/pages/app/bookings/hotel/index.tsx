import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { HotelBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
// import SimpleHeader from "@/components/SimpleHeader";
// import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import HotelBookingCard from "./_components";
// import { StudioBookingCard } from "./_components/StudioBookingCard";
type status = "pending" | "confirmed" | "cancelled" | "completed";
export default function index() {
  const [status, setStatus] = useState<status>("confirmed");
  const props = usePagination();
  const query = useQuery<
    ApiResponse<{
      hotelBookings: HotelBooking[];
    }>
  >({
    queryKey: ["studio-bookings", status],
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
      <SimpleTitle title={"Studio Bookings"} />
      <div className="tabs">
        <a
          className={`tab tab-lg tab-lifted ${
            status === "cancelled" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("confirmed")}
        >
          Confirmed
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            status === "cancelled" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("cancelled")}
        >
          Cancelled
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            status === "completed" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("completed")}
        >
          Completed
        </a>
        <a
          className={`tab tab-lg tab-lifted ${
            status === "pending" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("pending")}
        >
          Scheduled
        </a>
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.hotelBookings;
          return (
            <section className="space-y-4">
              <div className="grid  gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {list.map((booking) => (
                  <HotelBookingCard booking={booking} key={booking.id} />
                ))}
                <div className="mt-4"></div>
              </div>
              <EmptyList list={list} />

              <SimplePaginator {...props} />
            </section>
          );
        }}
      </SuspensePageLayout>
    </div>
  );
}
