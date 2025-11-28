import apiClient from "@/api/apiClient";
import type { Hotel } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleInput from "@/components/SimpleInput";
import SimpleTextArea from "@/components/SimpleTextArea";
import { extract_message } from "@/helpers/auth";
import { useModal } from "@/store/modals";
import { useMutation } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Users, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function HotelRooms({
  item,
  refetch,
}: {
  item: Hotel["rooms"];
  refetch: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<Hotel["rooms"][number]>();
  const new_form = useForm<Hotel["rooms"][number]>();
  const modal = useModal();
  const onSubmit = (data: Hotel["rooms"][number]) => {
    toast.promise(() => mutateAsync(data), {
      loading: "Updating room...",
      success: extract_message,
      error: extract_message,
    });
  };
  const { id } = useParams({
    from: "/app/hotel/$id",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: Hotel["rooms"][number]) => {
      const new_data = {
        name: data.name,
        description: data.description,
        pricePerNight: data.pricePerNight,
        capacity: data.capacity,
        imageUrls: data.imageUrls,
        // isAvailable: data.isAvailable,
      } satisfies Partial<Hotel["rooms"][number]>;
      console.log(new_data);
      let resp = await apiClient.put(`admins/hotels/${id}/rooms/${data.id}`, {
        ...new_data,
      });
      return resp.data;
    },
    onSuccess: () => {
      modal.closeModal();
      refetch();
    },
  });

  const add_modal = useModal();

  const add_room = useMutation({
    mutationFn: async (data: Partial<Hotel["rooms"][number]>) => {
      let resp = await apiClient.post(`admins/hotels/${id}/rooms`, data);
      return resp.data;
    },
    onSuccess: () => {
      refetch();
      add_modal.closeModal();
    },
  });

  const handleAddSumbit = (data: Partial<Hotel["rooms"][number]>) => {
    toast.promise(add_room.mutateAsync(data), {
      loading: "Adding room...",
      success: "Room added successfully",
      error: extract_message,
    });
  };
  const handleEditRoom = (room: Hotel["rooms"][number]) => {
    reset({ ...room });
    modal.showModal();
  };

  return (
    <>
      <div className="">
        <button
          className="btn btn-primary mb-2"
          onClick={() => {
            reset();
            add_modal.showModal();
          }}
        >
          Add Room
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {item.map((room) => (
            <HotelRoomCard
              key={room.id}
              room={room}
              hotelId={id}
              onEdit={handleEditRoom}
              refetch={refetch}
            />
          ))}
        </div>
      </div>

      <Modal ref={add_modal.ref}>
        <form
          action=""
          className="p-4 space-y-4"
          onSubmit={new_form.handleSubmit(handleAddSumbit)}
        >
          <h2>Add Room</h2>
          <SimpleInput {...new_form.register("name")} label="Name" />
          <SimpleTextArea
            {...new_form.register("description")}
            label="Description"
          />
          <SimpleInput
            {...new_form.register("pricePerNight")}
            label="pricePerNight"
            type="number"
          />
          <SimpleInput
            {...new_form.register("capacity")}
            label="Capacity"
            type="number"
          />
          <button disabled={isPending} className="btn btn-block btn-primary">
            Add
          </button>
        </form>
      </Modal>

      <Modal ref={modal.ref}>
        <form
          action=""
          className="p-4 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2>Edit Room</h2>
          <SimpleInput {...register("name")} label="Name" />
          <SimpleTextArea {...register("description")} label="Description" />
          <SimpleInput
            {...register("pricePerNight")}
            label="pricePerNight"
            type="number"
          />
          <SimpleInput
            {...register("capacity")}
            label="Capacity"
            type="number"
          />
          <button disabled={isPending} className="btn btn-block btn-primary">
            Edit
          </button>
        </form>
      </Modal>
    </>
  );
}

function HotelRoomCard({
  room,
  onEdit,
  refetch,
  hotelId,
}: {
  room: Hotel["rooms"][number];
  onEdit: (room: Hotel["rooms"][number]) => void;
  refetch: () => void;
  hotelId: string;
}) {
  const delete_mutate = useMutation({
    mutationFn: async (room_id: string) => {
      let resp = await apiClient.delete(
        `admins/hotels/${hotelId}/rooms/${room_id}`,
      );
      return resp.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  const availability_mutate = useMutation({
    mutationFn: async () => {
      const status = room.isAvailable ? "unavailable" : "available";
      let resp = await apiClient.put(
        `admins/hotels/${hotelId}/rooms/${room.id}/${status}`,
      );
      return resp.data;
    },
    onSuccess: () => {
      refetch();
      toast.success(
        `Room set to ${room.isAvailable ? "unavailable" : "available"}`,
      );
    },
    onError: (error) => {
      toast.error(extract_message(error));
    },
  });

  const handleDeleteRoom = (roomId: string) => {
    toast.promise(() => delete_mutate.mutateAsync(roomId), {
      loading: "Deleting...",
      success: extract_message,
      error: extract_message,
    });
  };

  return (
    <div key={room.id} className=" bg-base-100 shadow-xl overflow-hidden">
      {/*<figure className="h-48 w-full rounded-md">
        <img
          src={"https://picsum.photos/400/225"}
          alt={room.name}
          className="w-full h-full object-cover rounded-t-md"
        />
      </figure>*/}
      <div className="  p-4">
        <h3 className=" text-lg font-bold mb-2">{room.name}</h3>
        <p className="text-base-content  text-xs text-opacity-80 mb-4 flex-grow">
          {room.description}
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <p>
              Price per night:{" "}
              <span className="font-semibold">${room.pricePerNight}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            <p>
              Capacity: <span className="font-semibold">{room.capacity}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {room.isAvailable ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-error" />
            )}
            <p>
              Available:{" "}
              <span className="font-semibold">
                {room.isAvailable ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
        <div className="card-actions justify-end mt-6">
          <button onClick={() => onEdit(room)} className="btn btn-info btn-sm">
            Edit
          </button>
          <button
            disabled={availability_mutate.isPending}
            onClick={() => availability_mutate.mutate()}
            className={`btn btn-sm ${
              room.isAvailable ? "btn-warning" : "btn-success"
            }`}
          >
            {room.isAvailable ? "Set Unavailable" : "Set Available"}
          </button>
          <button
            disabled={delete_mutate.isPending}
            onClick={() => handleDeleteRoom(room.id)}
            className="btn btn-error btn-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
