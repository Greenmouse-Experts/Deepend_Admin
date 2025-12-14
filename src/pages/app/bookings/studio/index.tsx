import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { StudioBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StudioBookingCard } from "./_components/StudioBookingCard";
import SimpleSearch from "@/components/SimpleSearch";
import { remove_nulls, useSearchParams } from "@/helpers/client";
type status = "cancelled" | "completed" | "scheduled";
export default function index() {
  const [status, setStatus] = useState<status>("scheduled");
  const searchProps = useSearchParams();
  const props = usePagination();
  const query = useQuery<
    ApiResponse<{
      studioBookings: StudioBooking[];
    }>
  >({
    queryKey: ["studio-bookings", status, props.page, searchProps.search],
    queryFn: async () => {
      const params = {
        status,
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };
      let resp = await apiClient.get(`admins/studios/bookings`, {
        params: remove_nulls(params),
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
            status === "scheduled" ? "tab-active" : ""
          }`}
          onClick={() => setStatus("scheduled")}
        >
          Scheduled
        </a>
      </div>
      <SimpleSearch props={searchProps} />
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.studioBookings;
          return (
            <section className="space-y-4">
              <div className="grid  gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {list.map((booking) => (
                  <StudioBookingCard booking={booking} key={booking.id} />
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
