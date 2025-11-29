import apiClient, { type ApiResponse } from "@/api/apiClient";
import type { Studio, StudioAvailability } from "@/api/types";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleLoader from "@/components/SimpleLoader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useModal } from "@/store/modals";
import { useForm } from "react-hook-form";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleInput from "@/components/SimpleInput";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import LocalSelect from "@/components/LocalSelect";

interface Selected {
  [key: string]: StudioAvailability;
}
export default function index() {
  const { id } = useParams({
    from: "/app/studio/$id",
  });
  const [selected, setSelected] = useState<Selected>({});
  const query = useQuery<ApiResponse<StudioAvailability[]>>({
    queryKey: ["studio-availability", id],
    queryFn: async () => {
      let resp = await apiClient.get(`admins/studios/${id}/availability`);
      return resp.data;
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const values = Object.keys(selected);
      let resp = await apiClient.delete(`admins/studios/${id}/availability`, {
        data: {
          availabilityIds: values,
        },
      });
      return resp.data;
    },
    onSuccess: () => {
      query.refetch();
    },
  });

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
  const { ref, showModal, closeModal } = useModal();
  const { register, handleSubmit, setValue, watch } =
    useForm<Partial<StudioAvailability>>();
  const onSubmit = (data: Partial<StudioAvailability>) => {
    toast.promise(
      async () => {
        let resp = await apiClient.post(`admins/studios/availability`, {
          ...data,
          studioId: id,
        });
        closeModal();
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
  if (query.isLoading)
    return (
      <>
        <SimpleHeader title={"Studio Availability"} />
        <SimpleLoader />
      </>
    );

  const daysOfWeek = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];

  const getDayName = (dayOfWeek: number) => {
    return daysOfWeek.find((day) => day.id === dayOfWeek)?.name || "Unknown";
  };

  return (
    <>
      <SimpleHeader title={"Studio Availability"}>
        <div className="flex gap-2">
          {Object.keys(selected).length > 0 && (
            <button
              onClick={() => {
                toast.promise(mutateAsync, {
                  loading: "Deleting...",
                  success: extract_message,
                  error: extract_message,
                });
              }}
              disabled={isPending}
              className="btn btn-error btn-sm"
            >
              Delete Selected ({Object.keys(selected).length})
            </button>
          )}
          <button
            onClick={() => showModal()}
            disabled={isPending}
            className="btn btn-primary btn-sm"
          >
            Add Availability
          </button>
        </div>
      </SimpleHeader>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 ">
          Availability for Studio {id}
        </h2>
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
              No availability found for this studio. Click "Add Availability" to
              get started!
            </p>
          </div>
        )}
      </div>
      <Modal ref={ref}>
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
}

const AvailablityCard = ({
  card,
  isSelected,
  onSelect,
  refetch,
  getDayName,
}: {
  card: StudioAvailability;
  isSelected: boolean;
  onSelect: (availability: StudioAvailability) => void;
  refetch: () => void;
  getDayName: (dayOfWeek: number) => string;
}) => {
  return (
    <li
      className={`card bg-base-100 shadow-lg border ${
        isSelected
          ? "border-primary ring ring-primary ring-offset-base-100 ring-offset-2"
          : "border-base-200"
      } cursor-pointer`}
      onClick={() => onSelect(card)}
    >
      <div className="card-body p-6">
        <h3 className="card-title text-xl font-semibold mb-2">
          Day of Week: {getDayName(card.dayOfWeek)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-base-content/80">
          <p>
            <span className="font-medium">Start Time:</span> {card.startTime}
          </p>
          <p>
            <span className="font-medium">End Time:</span> {card.endTime}
          </p>
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(card.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Updated At:</span>{" "}
            {new Date(card.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </li>
  );
};
