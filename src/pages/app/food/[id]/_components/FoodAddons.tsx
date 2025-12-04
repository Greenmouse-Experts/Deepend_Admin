import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { FoodAddon } from "@/api/types";
import EmptyList from "@/components/EmptyList";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import SimpleTitle from "@/components/SimpleTitle";
import CustomTable from "@/components/tables/CustomTable";
import { extract_message } from "@/helpers/auth";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export default function FoodAddons({ id }: { id: string }) {
  let query = useQuery({
    queryKey: ["food-addon-association", id],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/foods/${id}/addons`);
      return resp.data;
    },
  });

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
  ];

  const remove_addon = async (addonId) => {
    let resp = await apiClient.delete(`admins/foods/${id}/addons/items`, {
      data: {
        addonItemIds: [addonId],
      },
    });
    query.refetch();
    return resp.data;
  };

  // const add_addon = async()=>
  //   {
  //     le
  //   }
  const actions = [
    {
      key: "remove",
      label: "Remove",
      action: (item: FoodAddon) => {
        toast.promise(remove_addon(item.id), {
          loading: "Removing addon...",
          success: "Addon removed successfully",
          error: extract_message,
        });
        console.log("Remove addon:", item);
      },
    },
  ];

  return (
    <section>
      <SimpleTitle title="Food Addons" />
      <SuspenseCompLayout query={query}>
        {(data: ApiResponse<FoodAddon[]>) => {
          const payload = data.payload;
          return (
            <div>
              <EmptyList list={payload} />
              <CustomTable data={payload} columns={columns} actions={actions} />
            </div>
          );
        }}
      </SuspenseCompLayout>
    </section>
  );
}
