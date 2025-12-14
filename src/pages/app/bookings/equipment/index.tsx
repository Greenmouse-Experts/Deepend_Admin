import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { EquipmentBooking } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import EquipmentBookingCard from "./_components/EquipmentBookingCard";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
import { usePagination } from "@/store/pagination";
import SimplePaginator from "@/components/SimplePaginator";
type selectedType = "ongoing" | "completed" | "cancelled";
const equipment_params: selectedType[] = ["ongoing", "completed", "cancelled"];
export default function index() {
  const [selected, setSelected] = useState<selectedType>("ongoing");
  const searchProps = useSearchParams();
  const props = usePagination();

  const query = useQuery<
    ApiResponse<{ equipmentRentalBookings: EquipmentBooking[] }>
  >({
    queryKey: ["equipments-bookings", selected, searchProps.search, props.page],
    queryFn: async () => {
      const params = {
        status: selected,
        search: searchProps.search,
        page: props.page,
      };
      let resp = await apiClient.get("admins/equipments/bookings", {
        params: remove_nulls(params),
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
      <SimpleSearch props={searchProps} />
      <SuspensePageLayout query={query} showTitle={false}>
        {(resp) => {
          const data = resp.payload.equipmentRentalBookings;
          return (
            <>
              <div className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,auto))]">
                {data.map((item) => {
                  return (
                    <EquipmentBookingCard
                      item={item}
                      key={item.id}
                      refetch={query.refetch}
                    />
                  );
                })}
              </div>
              <EmptyList list={data} />
            </>
          );
        }}
      </SuspensePageLayout>
      <div className="mt-2">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}

const Content = () => {};
