import apiClient, { type ApiResponse } from "@/api/apiClient";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import CustomTable from "@/components/tables/CustomTable";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

export default function index() {
  const { categoryId } = useParams({
    from: "/app/food/addons/item/$categoryId",
    select: ({ categoryId }) => ({
      categoryId,
    }),
  });

  const query = useQuery<
    ApiResponse<
      { name: string; id: string; description: string; price: number }[]
    >
  >({
    queryKey: ["addon-items", categoryId],
    queryFn: async () => {
      let resp = await apiClient.get(
        `admins/foods/addons/categories/${categoryId}/items`,
        {
          params: {
            page: 1,
            limit: 10,
          },
        },
      );
      return resp.data;
    },
  });

  return (
    <SuspensePageLayout query={query} title={"Food Addon Items"}>
      {(data) => {
        const payload = data.payload;
        const columns = [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "price", label: "Price" },
        ];
        return <CustomTable data={payload} columns={columns} />;
      }}
    </SuspensePageLayout>
  );
}
