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
import HotelBookingCard from "./_components/HotelBookingCard";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
const status_list = ["confirmed", "cancelled", "completed"];
export default function index() {
  const [status, setStatus] =
    useState<(typeof status_list)[number]>("confirmed");
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<
    ApiResponse<{
      hotelBookings: HotelBooking[];
    }>
  >({
    queryKey: ["hotel-bookings", status, props.page, searchProps.search],
    queryFn: async () => {
      const params = {
        status,
        page: props.page,
        limit: 10,
        search: searchProps.search,
      };
      let resp = await apiClient.get(`admins/hotels/bookings`, {
        params: remove_nulls(params),
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
            className={`tab capitalize tab-lg tab-lifted ${
              stat === status ? "tab-active" : ""
            }`}
            onClick={() => setStatus(stat)}
          >
            {stat}
          </a>
        ))}
      </div>
      <SimpleSearch props={searchProps} />
      <SuspensePageLayout query={query} showTitle={false}>
        {(data) => {
          let list = data.payload.hotelBookings;
          return (
            <section className="space-y-4">
              <div className="grid  gap-4 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                {list.map((booking) => (
                  <HotelBookingCard
                    refetch={query.refetch}
                    booking={booking}
                    key={booking.id}
                  />
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
