import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodAddon } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery } from "@tanstack/react-query";

export default function FoodAddons({ id }: { id: string }) {
  let query = useQuery({
    queryKey: ["food-addon-association", id],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/foods/${id}/addons`);
      return resp.data;
    },
  });
  return (
    <section>
      <SimpleTitle title="Food Addons" />
      <SuspenseCompLayout query={query}>
        {(data: ApiResponse<FoodAddon[]>) => {
          const payload = data.payload;
          return (
            <div>
              <EmptyList list={payload} />
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payload.map((addon) => (
                      <tr key={addon.id}>
                        <td>{addon.id}</td>
                        <td>{addon.name}</td>
                        <td>{addon.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }}
      </SuspenseCompLayout>
    </section>
  );
}
