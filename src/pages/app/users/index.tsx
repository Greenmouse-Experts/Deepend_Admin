import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { User } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import { useQuery } from "@tanstack/react-query";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import CustomTable from "@/components/tables/CustomTable";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<User[]>>({
    queryKey: ["users", props.page],
    queryFn: async () => {
      const response = await apiClient.get("admins/users", {
        params: {
          page: props.page,
          limit: 20,
        },
      });
      return response.data;
    },
  });
  const items = query.data?.payload;

  const columns = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    {
      key: "emailVerified",
      label: "Verified",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
  ];

  return (
    <QueryPageLayout
      query={query}
      title={
        <span>
          Users <span className="label">({items?.length || 0})</span>
        </span>
      }
    >
      <CustomTable data={items} columns={columns} />
      <div className="mt-4">
        <SimplePaginator {...props} />
      </div>
    </QueryPageLayout>
  );
}
