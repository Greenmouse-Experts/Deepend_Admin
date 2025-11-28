import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { User } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SimpleHeader from "@/components/SimpleHeader";
import { useQuery } from "@tanstack/react-query";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<User[]>>({
    queryKey: ["users", props.page],
    queryFn: async () => {
      const response = await apiClient.get("admins/users", {
        params: {
          page: props.page,
          limit: 10,
        },
      });
      return response.data;
    },
  });
  const items = query.data?.payload;
  return (
    <QueryPageLayout
      query={query}
      title={
        <span>
          Users <span className="label">({items?.length || 0})</span>
        </span>
      }
    >
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.emailVerified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <SimplePaginator {...props} />
      </div>
    </QueryPageLayout>
  );
}
