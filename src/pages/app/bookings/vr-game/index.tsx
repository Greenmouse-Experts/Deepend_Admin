import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { HotelBooking, VrgameBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
// import SimpleHeader from "@/components/SimpleHeader";
// import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import VRGameCard from "../../vr/_components/VRGameCard";
import GameBookingCard from "./_components/GameBookingCard";
// import HotelBookingCard from "./_components";
type status = "cancelled" | "completed";
export default function index() {
  const [status, setStatus] = useState<status>("completed");
  const props = usePagination();
  const query = useQuery<
    ApiResponse<{
      vrgameTickets: VrgameBooking[];
    }>
  >({
    queryKey: ["vrgame-bookings", status],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/vrgames/purchases`, {
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
      <SimpleTitle title={"Vr Game Purchase"} />
      <div className="tabs">
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
      </div>
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.vrgameTickets;
          return (
            <section className="space-y-4">
              <div className="grid  gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {list.map((booking) => (
                  <>
                    <GameBookingCard key={booking.id} booking={booking} />
                  </>
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
