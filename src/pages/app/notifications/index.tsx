import apiClient, { type ApiResponse } from "@/api/apiClient";
import { toast_wrapper } from "@/api/client";
import EmptyList from "@/components/EmptyList";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimplePaginator from "@/components/SimplePaginator";
import SimpleTitle from "@/components/SimpleTitle";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationsResponse<T = any> extends ApiResponse {
  payload: {
    notifications: {
      id: number;
      title: string;
      message: string;
      isRead: boolean;
      createdAt: string;
    }[];
  };
  nextPage: boolean | null;
  prevPage: boolean | null;
  perPage: number;
}
const tabs = ["unread", "read"];

export default function index() {
  const props = usePagination();
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>(
    tabs[0],
  );
  const query = useQuery<NotificationsResponse<any[]>>({
    queryKey: ["Notifications", selectedTab, props.page],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/notifications/${selectedTab}`, {
        params: {
          page: props.page,
        },
      });
      return resp.data;
    },
  });
  useEffect(() => {
    toast.info("Click notification to mark as read  ");
  }, []);

  return (
    <div>
      <SimpleTitle
        title={`Notifications (${query.data?.payload?.notifications?.length || 0})`}
      ></SimpleTitle>
      <div className="py-2 mb-2 bg-base-100 shadow px-2 ring ring-current/20 rounded-box ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`btn btn-primary capitalize btn-ghost ${selectedTab === tab ? "btn-active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <SuspensePageLayout showTitle={false} query={query}>
        {(data) => {
          const payload = data.payload.notifications;
          return (
            <>
              <ul className="menu w-full space-y-4 p-0">
                {payload.map((item) => {
                  return (
                    <>
                      <li key={item.id} className=" shadow-xl ">
                        <a className="flex-1 flex py-4 ring ring-current/20">
                          <NotificationCard
                            item={item}
                            refetch={query.refetch}
                          />
                        </a>
                      </li>
                    </>
                  );
                })}
              </ul>
              {/*//@ts-ignore*/}
              <EmptyList list={payload as any}> </EmptyList>
              {/*<SimplePaginator ></SimplePaginator>*/}
            </>
          );
        }}
      </SuspensePageLayout>
      <div className="mt-4">
        <SimplePaginator {...props} />
      </div>
    </div>
  );
}

const NotificationCard = ({ item, refetch }: { item: any; refetch: any }) => {
  const mutation = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.put(`admins/notifications/${item.id}/read`);
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const call_mark_read = () => toast_wrapper(mutation.mutateAsync);

  return (
    <div
      className="flex    flex-1"
      onClick={() => {
        call_mark_read();
      }}
      // onDoubleClick={() => {
      //   console.log("ss");
      // }}
    >
      <div className="space-y-2 flex-1  ">
        <h2 className="card-title">{item.title}</h2>
        <p>{item.message}</p>
      </div>
      <div className="ml-auto w-fit ">
        {item.isRead ? (
          <div className="badge badge-soft badge-info ring">Read</div>
        ) : (
          <div className="badge badge-soft badge-success ring">Unread</div>
        )}
      </div>
    </div>
  );
};
