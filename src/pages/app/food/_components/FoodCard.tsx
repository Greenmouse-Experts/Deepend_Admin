import apiClient from "@/api/apiClient";
import type { FoodProps } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export default function FoodCard({
  item,
  refetch,
}: {
  item: FoodProps;
  refetch: () => any;
}) {
  const toggle_status = async () => {
    const status = item.isAvailable ? "unavailable" : "available";
    let resp = await apiClient.put(`admins/foods/${item.id}/${status}`);
    return resp.data;
  };
  const mutate = useMutation({
    mutationFn: toggle_status,
    onSuccess: () => {
      refetch();
      toast.success("Status updated successfully");
    },
  });
  return (
    <div
      key={item.id}
      className="card card-compact bg-base-100 shadow-xl rounded-lg "
    >
      <figure className="relative h-48">
        <img
          src={item.imageUrls[0]?.url || "https://picsum.photos/400/225"}
          loading="lazy"
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div
          className={`badge absolute top-3 right-3 ${
            item.isAvailable ? "badge-success" : "badge-error"
          } text-white`}
        >
          {item.isAvailable ? "Available" : "Unavailable"}
        </div>
      </figure>
      <div className="card-body p-5">
        <div className="form-control">
          <label className="label cursor-pointer gap-3">
            <span className="label-text text-base font-medium">Status</span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-md"
              checked={item.isAvailable}
              onChange={() =>
                toast.promise(mutate.mutateAsync(), {
                  loading: "Updating status...",
                  success: "Status updated successfully!",
                  error: extract_message,
                })
              }
            />
          </label>
        </div>
        <h2 className="card-title text-xl font-extrabold text-base-content leading-tight">
          {item.name}
        </h2>
        <p className="text-sm text-base-content/80 line-clamp-2 mb-3">
          {item.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">
            NGN {item.price}
          </span>
        </div>
        <div className="card-actions justify-center mt-auto">
          <Link
            to="/app/food/$id"
            //@ts-ignore
            params={{ id: item.id }}
            className="btn btn-primary btn-md btn-block rounded-full font-semibold"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
