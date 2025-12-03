import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { StudioAvailability } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import LocalSelect from "@/components/LocalSelect";
import SimpleInput from "@/components/SimpleInput";
import SimpleTitle from "@/components/SimpleTitle";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const daysOfWeek = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];
interface Selected {
  [key: string]: StudioAvailability;
}
export default function GameAvail({ gameId }: { gameId: string }) {
  const query = useQuery<ApiResponse<any[]>>({
    queryKey: ["vr-game-avail", gameId],
    queryFn: async () => {
      const response = await apiClient(`admin/vr/games/${gameId}/availability`);
      const data = await response.data;
      return data;
    },
  });
  const [selected, setSelected] = useState<Selected>({});
  const handleSelect = (availability: StudioAvailability) => {
    setSelected((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[availability.id]) {
        delete newSelected[availability.id];
      } else {
        newSelected[availability.id] = availability;
      }
      return newSelected;
    });
  };
  const modal = useModal();
  const { register, handleSubmit, setValue, watch } =
    useForm<Partial<StudioAvailability>>();
  const getDayName = (dayOfWeek: number) => {
    return daysOfWeek.find((day) => day.id === dayOfWeek)?.name || "Unknown";
  };
  const onSubmit = (data: Partial<StudioAvailability>) => {
    toast.promise(
      async () => {
        let resp = await apiClient.post(`admins/vrgames/availability`, {
          ...data,
          vrGameId: gameId,
        });
        modal.closeModal();
        query.refetch();
        return resp.data;
      },
      {
        loading: "Saving...",
        success: extract_message,
        error: extract_message,
      },
    );
  };
  return (
    <div>
      <SimpleTitle
        //@ts-ignore
        title={<span className="text-base">Game Availability</span>}
      />
      <SuspenseCompLayout query={query}>
        {(data: ApiResponse) => {
          let resp = data.payload;
          return (
            <>
              <div className="container mx-auto p-4">
                {query.data && query.data.payload.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {query.data.payload.map((availability) => (
                      <AvailablityCard
                        card={availability}
                        key={availability.id}
                        isSelected={!!selected[availability.id]}
                        onSelect={handleSelect}
                        refetch={query.refetch}
                        getDayName={getDayName}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-base-200 rounded-lg shadow-inner">
                    <p className="text-lg text-gray-600">
                      No availability found for this studio. Click "Add
                      Availability" to get started!
                    </p>
                  </div>
                )}
              </div>
              <Modal ref={modal.ref}>
                <form
                  action=""
                  className="space-y-6 p-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add New Availability
                  </h2>
                  <LocalSelect
                    label="Day of Week"
                    options={daysOfWeek}
                    value={watch("dayOfWeek") ?? ""}
                    onChange={(value) => setValue("dayOfWeek", parseInt(value))}
                    render={(item: { id: number; name: string }) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    )}
                  />
                  <SimpleInput
                    {...register("startTime")}
                    label="Start Time"
                    type="time"
                    className="input input-bordered w-full"
                  />
                  <SimpleInput
                    {...register("endTime")}
                    label="End Time"
                    type="time"
                    className="input input-bordered w-full"
                  />
                  <button
                    className="btn btn-primary btn-block text-lg py-3"
                    type="submit"
                  >
                    Save Availability
                  </button>
                </form>
              </Modal>
            </>
          );
        }}
      </SuspenseCompLayout>
    </div>
  );
}

const AvailablityCard = ({
  card,
  isSelected,
  onSelect,
  getDayName,
}: {
  card: StudioAvailability;
  isSelected: boolean;
  onSelect: (availability: StudioAvailability) => void;
  refetch: () => void; // refetch is declared but its value is never read.
  getDayName: (dayOfWeek: number) => string;
}) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div
      className={`card bg-gradient-to-br from-base-100 to-base-200 shadow-xl ${
        isSelected
          ? "border-2 border-primary ring-4 ring-primary ring-offset-2 ring-offset-base-100"
          : "border border-base-300"
      } cursor-pointer`}
      onClick={() => onSelect(card)}
    >
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title text-2xl font-extrabold text-primary">
            {getDayName(card.dayOfWeek)}
          </h3>
          <div
            className={`badge ${
              isSelected ? "badge-primary" : "badge-outline"
            } badge-lg`}
          >
            {isSelected ? "Selected" : "Select"}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-base-content/70">
            Time Slot
          </p>
          <p className="text-3xl font-bold text-base-content">
            {formatTime(card.startTime)} - {formatTime(card.endTime)}
          </p>
        </div>

        <div className="divider my-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-base-content/60 mt-4">
          <p>
            <span className="font-medium">Created:</span>{" "}
            {new Date(card.createdAt).toLocaleDateString()}
            {" at "}
            {new Date(card.createdAt).toLocaleTimeString()}
          </p>
          <p>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(card.updatedAt).toLocaleDateString()}
            {" at "}
            {new Date(card.updatedAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};
