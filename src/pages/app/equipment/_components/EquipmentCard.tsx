import apiClient from "@/api/apiClient";
import type { RentalEquipment } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu, Edit, Eye, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function EquipmentCard({
  itm,
  refetch,
}: {
  itm: RentalEquipment;
  refetch: () => any;
}) {
  const mutate = useMutation({
    mutationFn: (fn: () => Promise<any>) => fn(),
    onSuccess: () => {
      refetch();
    },
  });
  const toggle_availble = async () => {
    const status = itm.isAvailable ? "unavailable" : "available";
    let resp = await apiClient.put(`admins/equipments/${itm.id}/${status}`);
    return resp.data;
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl overflow-hidden flex flex-col h-full transition-transform duration-200 hover:scale-[1.02] border border-base-200">
      <figure className="w-full h-[200px] relative bg-base-200">
        {itm.imageUrls && itm.imageUrls.length > 0 ? (
          <img
            src={itm.imageUrls[0].url}
            alt={itm.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-base-200 text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          {itm.isAvailable ? (
            <div className="badge badge-success gap-2 text-white font-semibold">
              <ToggleRight size={16} /> Available
            </div>
          ) : (
            <div className="badge badge-error gap-2 text-white font-semibold">
              <ToggleLeft size={16} /> Unavailable
            </div>
          )}
        </div>
      </figure>
      <div className="card-body p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start ">
            <h2 className="card-title text-lg line-clamp-2 flex-grow pr-2">
              {itm.name}
            </h2>
            <div className="badge badge-outline badge-primary text-xs font-semibold">
              {itm.category.name}
            </div>
          </div>
          {/*<p className="text-sm text-base-content/80 line-clamp-3 mb-3 min-h-[60px]">
            {itm.description.trim() || "No description available."}
          </p>*/}
          <div className=" space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-base-content/70">
                Price/day:
              </span>
              <span className="font-bold text-primary">
                NGN {itm.rentalPricePerDay}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-base-content/70">
                Quantity:
              </span>
              <span className="font-bold">{itm.quantityAvailable}</span>
            </div>
          </div>
        </div>
        <div className="card-actions justify-end mt-auto">
          <div className="dropdown dropdown-top dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost btn-circle text-base-content hover:bg-base-200"
              aria-label="Options"
            >
              <Menu size={20} />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li>
                <Link
                  to={`/app/equipment/${itm.id}/edit`}
                  className="flex items-center gap-2 hover:bg-base-200"
                >
                  <Edit size={18} /> Edit
                </Link>
              </li>
              <li>
                <button
                  disabled={mutate.isPending}
                  onClick={() => {
                    toast.promise(mutate.mutateAsync(toggle_availble), {
                      loading: "Updating availability...",
                      error: extract_message,
                      success: (data) =>
                        data.message || "Availability updated!",
                    });
                  }}
                  className="flex items-center gap-2 hover:bg-base-200"
                >
                  {itm.isAvailable ? (
                    <ToggleLeft size={18} />
                  ) : (
                    <ToggleRight size={18} />
                  )}
                  {itm.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </button>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 text-error hover:bg-error/10"
                  onClick={() => {
                    toast.promise(
                      async () => {
                        let resp = await apiClient.delete(
                          `admins/equipments/${itm.id}`,
                        );
                        refetch();
                        return resp.data;
                      },
                      {
                        loading: "Deleting " + itm.name + "...",
                        success: (data) => data.message || "Equipment deleted!",
                        error: extract_message,
                      },
                    );
                  }}
                >
                  <Trash2 size={18} /> Delete
                </button>
              </li>
              <li>
                <Link
                  to={`/app/equipment/${itm.id}`}
                  className="flex items-center gap-2 hover:bg-base-200"
                >
                  <Eye size={18} /> Details
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
