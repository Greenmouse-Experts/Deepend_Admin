import apiClient from "@/api/apiClient";
import type { RentalEquipment } from "@/api/types";
import { extract_message } from "@/helpers/auth";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { toast } from "sonner";

export default function EquipmentCard({
  itm,
  refetch,
}: {
  itm: RentalEquipment;
  refetch: () => any;
}) {
  return (
    <div className="card w-full bg-base-100 shadow-xl overflow-hidden flex flex-col h-full">
      <figure className="w-full h-[200px] relative">
        {itm.imageUrls && itm.imageUrls.length > 0 ? (
          <img
            src={itm.imageUrls[0].url}
            alt={itm.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="https://picsum.photos/400/225"
            alt="Placeholder"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">
          {itm.isAvailable ? (
            <div className="badge badge-success ">Available</div>
          ) : (
            <div className="badge badge-error ">Unavailable</div>
          )}
        </div>
      </figure>
      <div className="card-body p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="card-title text-lg line-clamp-2 flex-grow pr-2">
              {itm.name}
            </h2>
            <div className="badge badge-info badge-outline text-xs">
              {itm.category.name}
            </div>
          </div>
          <p className="text-sm text-base-content/80 line-clamp-2 mb-3">
            {itm.description}
          </p>
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-base-content/70">
                Price/day:
              </span>
              <span className="font-semibold text-primary">
                ${itm.rentalPricePerDay}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-base-content/70">
                Quantity:
              </span>
              <span className="font-semibold">{itm.quantityAvailable}</span>
            </div>
          </div>
        </div>
        <div className="card-actions justify-end mt-auto">
          <div className="dropdown dropdown-top dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-primary btn-square"
            >
              <Menu />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={`/app/equipment/${itm.id}/edit`} className="">
                  Edit
                </Link>
              </li>
              <li>
                <button
                  className=""
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
                        success: extract_message,
                        error: extract_message,
                      },
                    );
                  }}
                >
                  Delete
                </button>
              </li>
              <li>
                <Link to={`/app/equipment/${itm.id}`}>Details</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
