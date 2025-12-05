import apiClient, { type ApiResponse } from "@/api/apiClient";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { useQuery } from "@tanstack/react-query";

interface NotificationsResponse<T = any> extends ApiResponse {
  payload: {
    notifications: T;
  };
  nextPage: boolean | null;
  prevPage: boolean | null;
  perPage: number;
}
export default function index() {
  const query = useQuery<NotificationsResponse<any[]>>({
    queryKey: ["Notifications"],
    queryFn: async () => {
      let resp = await apiClient.get("admins/notifications/read");
      return resp.data;
    },
  });
  return (
    <div>
      <SimpleTitle
        title={`Notifications (${query.data?.payload?.notifications?.length || 0})`}
      ></SimpleTitle>
      <SuspensePageLayout showTitle={false} query={query}>
        {(data) => {
          const payload = data.payload.notifications;
          return (
            <>
              {payload.map((item) => (
                <div key={item.id}>
                  <p>{item.title}</p>
                  <p>{item.message}</p>
                </div>
              ))}
              <EmptyList list={payload as any}> </EmptyList>
              {/*<SimplePaginator ></SimplePaginator>*/}
            </>
          );
        }}
      </SuspensePageLayout>
    </div>
  );
}
