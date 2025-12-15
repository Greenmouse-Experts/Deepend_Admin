import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import type { RentalEquipment } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSelect from "@/components/SimpleSelect";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import EquipmentCard from "./_components/EquipmentCard";
import { useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleHeader from "@/components/SimpleHeader";

export default function index() {
  const [cat, setCat] = useState(null);
  const searchProps = useSearchParams();
  const props = usePagination();
  const query = useQuery<ApiResponse<RentalEquipment[]>>({
    queryKey: ["vr", props.page, cat, searchProps.search],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: props.page,
        categoryId: cat,
        search: searchProps.search,
      };
      // only include categoryId if cat is not null
      // remove null/undefined keys from params
      Object.keys(params).forEach((key) => {
        if (params[key] == null) {
          delete params[key];
        }
      });

      const resp = await apiClient.get("admins/equipments", { params });
      return resp.data;
    },
  });
  useEffect(() => {
    console.log(cat);
  }, [cat]);
  const item = query.data?.payload;
  return (
    <>
      <SimpleHeader title={"Equipment Rental Items"}>
        <>
          <Link href="new" className="btn btn-primary">
            Add Equipment
          </Link>
          <SimpleSelect
            onChange={setCat}
            route="admins/equipments/categories"
            value={String(cat)}
            render={(item: { name: string; id: string }) => {
              return (
                <>
                  <option value={item.id}>{item.name}</option>
                </>
              );
            }}
          />
        </>
      </SimpleHeader>
      <SimpleSearch props={searchProps} />

      <SuspensePageLayout
        query={query}
        showTitle={false}
        title={"Equipment Rental Items"}
        headerActions={
          <>
            <Link href="new" className="btn btn-primary">
              Add Equipment
            </Link>
            <SimpleSelect
              onChange={setCat}
              route="admins/equipments/categories"
              value={String(cat)}
              render={(item: { name: string; id: string }) => {
                return (
                  <>
                    <option value={item.id}>{item.name}</option>
                  </>
                );
              }}
            />
          </>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-2">
          {item?.map((itm) => (
            <EquipmentCard refetch={query.refetch} itm={itm} key={itm.id} />
          ))}
        </div>
        <div className="mt-4">
          <SimplePaginator {...props} />
        </div>
      </SuspensePageLayout>
    </>
  );
}
