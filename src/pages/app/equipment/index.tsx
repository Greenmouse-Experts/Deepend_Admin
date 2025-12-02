import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import type { RentalEquipment } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleSelect from "@/components/SimpleSelect";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import EquipmentCard from "./_components/EquipmentCard";

export default function index() {
  const [cat, setCat] = useState(null);
  const props = usePagination();
  const query = useQuery<ApiResponse<RentalEquipment[]>>({
    queryKey: ["vr", props.page, cat],
    queryFn: async () => {
      const params: Record<string, any> = { page: props.page };
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
  const item = query.data?.payload;
  return (
    <QueryPageLayout
      query={query}
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
    </QueryPageLayout>
  );
}
