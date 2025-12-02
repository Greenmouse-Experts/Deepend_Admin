import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { AdvertBanner } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import { usePagination } from "@/store/pagination";
import { useQuery } from "@tanstack/react-query";
import Banner from "./_components/AdvertCard";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<AdvertBanner[]>>({
    queryKey: ["advert-banners-admin", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("admins/advert-banners", {
        params: {
          page: props.page,
          limit: 10,
        },
      });
      return resp.data;
    },
  });
  return (
    <SuspensePageLayout query={query} title={"Advert Banners"}>
      {(response: ApiResponse<AdvertBanner[]>) => {
        const banners = response.payload || [];
        return (
          <div className="container mx-auto p-4">
            {banners.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
                {banners.map((banner) => (
                  <Banner {...banner} refetch={query.refetch} />
                ))}
              </div>
            ) : (
              <p className="text-center text-lg">No advert banners found.</p>
            )}
            <div className="mt-8">
              <SimplePaginator {...props}></SimplePaginator>
            </div>
          </div>
        );
      }}
    </SuspensePageLayout>
  );
}
