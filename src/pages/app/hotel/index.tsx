import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Hotel } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import SimplePaginator from "@/components/SimplePaginator";
import CustomTable from "@/components/tables/CustomTable";
import { usePagination } from "@/store/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";

export default function index() {
  const props = usePagination();
  const query = useQuery<ApiResponse<Hotel[]>>({
    queryKey: ["hotels", props.page],
    queryFn: async () => {
      let resp = await apiClient.get("admins/hotels", {
        params: {
          page: props.page,
          limit: 10,
        },
      });
      return resp.data;
    },
  });

  const deleteHotelMutation = useMutation({
    mutationFn: async (hotelId: string) => {
      let resp = await apiClient.delete("admins/hotels/" + hotelId);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({
      hotelId,
      status,
    }: {
      hotelId: string;
      status: string;
    }) => {
      let resp = await apiClient.put(`admins/hotels/${hotelId}/${status}`);
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
    },
  });

  if (query.isLoading) {
    return (
      <>
        <SimpleHeader title={"Hotels"} />
        <SimpleLoader />
      </>
    );
  }
  const items = query.data?.payload || [];

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (_: any, item: Hotel) => (
        <div className="avatar">
          <div className="mask mask-squircle w-12 h-12">
            {item.imageUrls && item.imageUrls.length > 0 ? (
              <img src={item.imageUrls[0].url} alt={`Image of ${item.name}`} />
            ) : (
              <div className="w-12 h-12 bg-base-300 grid place-items-center">
                <span className="text-xs text-base-content/70">No Image</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "address",
      label: "Address",
      render: (_: any, item: Hotel) => (
        <p className="line-clamp-1">
          {item.address}, {item.city}, {item.state}, {item.country}
        </p>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => `${value} / 5`,
    },
    {
      key: "rooms",
      label: "Rooms",
      render: (_: any, item: Hotel) => item.rooms.length,
    },
    {
      key: "isAvailable",
      label: "Available",
      render: (value: boolean, item: Hotel) => (
        <input
          type="checkbox"
          className="toggle toggle-success toggle-sm"
          checked={value}
          onChange={() => {
            const status = item.isAvailable ? "unavailable" : "available";
            toast.promise(
              toggleAvailabilityMutation.mutateAsync({
                hotelId: item.id,
                status,
              }),
              {
                loading: "Updating availability...",
                success: "Availability updated successfully!",
                error: extract_message,
              },
            );
          }}
          // disabled={toggleAvailabilityMutation.isPending}
        />
      ),
    },
  ];

  const actions = [
    {
      key: "view",
      label: "View",
      action: (item: Hotel) => {
        window.location.href = `/app/hotel/${item.id}`;
      },
    },
    {
      key: "delete",
      label: "Delete",
      action: (item: Hotel) => {
        toast.promise(deleteHotelMutation.mutateAsync(item.id), {
          loading: "Deleting...",
          success: extract_message,
          error: extract_message,
        });
      },
    },
  ];

  return (
    <>
      <SimpleHeader title={"Hotels"}>
        <Link to="/app/hotel/new" className="btn btn-primary">
          Add New Hotel
        </Link>
      </SimpleHeader>
      <div className="container mx-auto ">
        <CustomTable data={items} columns={columns} actions={actions} />
      </div>
      <div className="mt-4">
        <SimplePaginator {...props} />
      </div>
    </>
  );
}
