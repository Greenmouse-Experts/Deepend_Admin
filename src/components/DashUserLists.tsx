import type { ApiResponse } from "@/api/apiClient";
import apiClient from "@/api/apiClient";
import type { User } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export default function DashUserLists() {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<ApiResponse<User[]>>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.get("admins/users", {
        params: {
          page: 1,
          limit: 5,
        },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (isError) {
    return <div className="alert alert-error">Error loading users.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.payload.map((user, index) => (
            <tr key={user.id}>
              <th>{index + 1}</th>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
