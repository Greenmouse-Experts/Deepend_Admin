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
      className="card card-compact bg-base-100 shadow-xl card-border"
    >
      <figure>
        <img
          src={item.imageUrls[0]?.url || "https://picsum.photos/400/225"}
          loading="lazy"
          alt={item.name}
          className="w-full h-32 object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">{item.name}</h2>
        <p className="text-sm line-clamp-2 text-base-content/80">
          {item.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-extrabold text-primary">
            ${item.price}
          </span>
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Available</span>
              <input
                type="checkbox"
                className="toggle toggle-success"
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
        </div>
        <div className="card-actions justify-end mt-4">
          <Link
            to="/app/food/$id"
            params={{ id: item.id }}
            className="btn btn-primary btn-sm btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
