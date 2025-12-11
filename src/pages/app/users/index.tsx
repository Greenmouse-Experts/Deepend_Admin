import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { User } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import { useQuery } from "@tanstack/react-query";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import CustomTable from "@/components/tables/CustomTable";
import { remove_nulls, useSearchParams } from "@/helpers/client";
import SimpleSearch from "@/components/SimpleSearch";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleTitle from "@/components/SimpleTitle";

export default function index() {
  const props = usePagination();
  const searchProps = useSearchParams();

  const query = useQuery<ApiResponse<User[]>>({
    queryKey: ["users", props.page, searchProps.search],
    queryFn: async () => {
      const initial = {
        page: props.page,
        search: searchProps.search,
      };

      const params = remove_nulls(initial);
      const response = await apiClient.get("admins/users", {
        params: params,
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
      render: (value: boolean) =>
        value ? (
          <span className="badge badge-success badge-sm">Yes</span>
        ) : (
          <span className="badge badge-error badge-sm">No</span>
        ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <SimpleTitle title="VR Games" />{" "}
        {/*<Lin to="new" className="btn btn-primary">
          Add New Game
        </Lin>*/}
      </div>
      <SuspensePageLayout
        query={query}
        showTitle={false}

        // title={
        //   <span>
        //     Users <span className="label">({items?.length || 0})</span>
        //   </span>
        // }
      >
        <div className="flex justify-end mb-4">
          <SimpleSearch props={searchProps} />
        </div>
        <CustomTable data={items} columns={columns} />
        <div className="mt-4">
          <SimplePaginator {...props} />
        </div>
      </SuspensePageLayout>
    </>
  );
}
