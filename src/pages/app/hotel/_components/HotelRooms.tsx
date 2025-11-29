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
import HotelRoomCard from "./HotelRoomCard";

export default function HotelRooms({
  item,
  refetch,
}: {
  item: Hotel["rooms"];
  refetch: () => void;
}) {
  const { register, handleSubmit, reset } = useForm<Hotel["rooms"][number]>();
  const new_form = useForm<Hotel["rooms"][number]>();

  const { id } = useParams({
    from: "/app/hotel/$id",
  });
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
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
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
