import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { RentalEquipment } from "@/api/types";
import QueryPageLayout from "@/components/layout/QueryPageLayout";
import SimpleCarousel from "@/components/SimpleCarousel";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Loader2, MapPin, DollarSign, Package, Tag } from "lucide-react";

export default function index() {
  const { id } = useParams({
    strict: false,
  });
  const query = useQuery<ApiResponse<RentalEquipment>>({
    queryKey: ["rental-equipment-details", id],
    queryFn: async () => {
      const resp = await apiClient.get("admins/equipments/" + id);
      return resp.data;
    },
  });

  return (
    <QueryPageLayout query={query} title={"Rental Equipment Details"}>
      <Page item={query.data?.payload} />
    </QueryPageLayout>
  );
}

const Page = ({ item }: { item: RentalEquipment }) => {
  return (
    <>
      <SimpleCarousel>
        {item.imageUrls.map((img) => (
          <div key={img.url} className="w-full h-[420px] bg-base-300 py-2">
            <img
              src={img.url}
              alt="Equipment Image"
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </SimpleCarousel>
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-bold">{item.name}</h2>
        <p className="text-gray-700">{item.description}</p>
        <div className="flex items-center space-x-2">
          <Tag size={20} />
          <span>Category:</span>
          <span>{item.category.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin size={20} />
          <span>Address:</span>
          <span>{item.address}</span>
        </div>
        <div className="flex items-center space-x-2">
          {/*<DollarSign size={20} />*/}
          <span>Price:</span>
          <span>{item.rentalPricePerDay} / day</span>
        </div>
      </div>
    </>
  );
};
