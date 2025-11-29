import apiClient from "@/api/apiClient";
import { uploadToCloudinary } from "@/api/cloud";
import type { Hotel } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleInput from "@/components/SimpleInput";
import SimpleTextArea from "@/components/SimpleTextArea";
import UpdateImages from "@/components/UpdateImages";
import { extract_message } from "@/helpers/auth";
import { useImages } from "@/helpers/images";
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

  // const { mutateAsync, isPending } = useMutation({
  //   mutationFn: async (data: Hotel["rooms"][number]) => {
  //     const new_data = {
  //       name: data.name,
  //       description: data.description,
  //       pricePerNight: data.pricePerNight,
  //       capacity: data.capacity,
  //       imageUrls: data.imageUrls,
  //       // isAvailable: data.isAvailable,
  //     } satisfies Partial<Hotel["rooms"][number]>;
  //     console.log(new_data);
  //     let resp = await apiClient.put(`admins/hotels/${id}/rooms/${data.id}`, {
  //       ...new_data,
  //     });
  //     return resp.data;
  //   },
  //   onSuccess: () => {
  //     modal.closeModal();
  //     refetch();
  //   },
  // });

  const add_modal = useModal();

  const add_room = useMutation({
    mutationFn: async (data: Partial<Hotel["rooms"][number]>) => {
      if (props.newImages) {
        let uploads = await uploadToCloudinary(props.newImages as any);
        data["imageUrls"] = [...props.images, ...uploads];
      }
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

  const props = useImages();

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
          <UpdateImages {...props} />
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
          <button
            disabled={add_room.isPending}
            className="btn btn-block btn-primary"
          >
            Add
          </button>
        </form>
      </Modal>
    </>
  );
}

function HotelRoomCard({
  room,
  refetch,
  hotelId,
}: {
  room: Hotel["rooms"][number];
  refetch: () => void;
  hotelId: string;
}) {
  const props = useImages(room.imageUrls);
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
  const simple_mut = useMutation({
    mutationFn: (fn: () => Promise<any>) => fn(),
    onSuccess: () => {
      refetch();
      modal.closeModal();
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
  const handleEdit = async (data: Partial<Hotel["rooms"][number]>) => {
    const new_data = {
      name: data.name,
      description: data.description,
      pricePerNight: data.pricePerNight,
      capacity: data.capacity,
      imageUrls: data.imageUrls,
      // isAvailable: data.isAvailable,
    } satisfies Partial<Hotel["rooms"][number]>;

    if (props.newImages) {
      let images = await uploadToCloudinary(props.newImages as any);
      new_data["imageUrls"] = [...props.images, ...images];
    }
    let resp = await apiClient.put(
      `admins/hotels/${hotelId}/rooms/${data.id}`,
      {
        ...new_data,
      },
    );
    return resp.data;
  };
  const form = useForm({
    defaultValues: {
      ...room,
    },
  });
  const { register } = form;
  const modal = useModal();
  const onSubmit = (data: Partial<Hotel["rooms"][number]>) => {
    toast.promise(
      simple_mut.mutateAsync(() => handleEdit(data)),
      {
        loading: "Updating room...",
        success: "Room updated successfully!",
        error: extract_message,
      },
    );
  };

  return (
    <>
      <div key={room.id} className=" bg-base-100 shadow-xl overflow-hidden">
        <figure className="h-42 w-full rounded-md">
          {room.imageUrls.length > 0 ? (
            <SimpleCarousel>
              {room.imageUrls.map((url) => (
                <img
                  key={url.path}
                  src={url.url}
                  className="object-cover h-42 w-full"
                  alt="Room Image"
                />
              ))}
            </SimpleCarousel>
          ) : (
            <div className="h-42 w-full bg-primary/10 rounded-md flex items-center justify-center">
              <p className="">No Image Available</p>
            </div>
          )}
        </figure>
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
            <button
              onClick={() => modal.showModal()}
              className="btn btn-info btn-sm"
            >
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
      <Modal ref={modal.ref}>
        <form
          action=""
          className="p-4 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h2>Edit Room</h2>
          <UpdateImages {...props} />

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
          <button
            disabled={simple_mut.isPending}
            className="btn btn-block btn-primary"
          >
            Edit
          </button>
        </form>
      </Modal>
    </>
  );
}
