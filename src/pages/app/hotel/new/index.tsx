import apiClient from "@/api/apiClient";
import { uploadToCloudinary } from "@/api/cloud";
import SimpleHeader from "@/components/SimpleHeader";
import SimpleInput from "@/components/SimpleInput";
import { extract_message } from "@/helpers/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import Autocomplete from "react-google-autocomplete";
import { GOOGLE_MAPS_KEY, type PlacesService } from "@/api/client";
interface NewHotel {
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrls: {
    url: string;
    path: string;
  }[];
}

export default function index() {
  const { register, control, setValue, handleSubmit } =
    useForm<Partial<NewHotel>>();
  const [images, setImages] = useState<FileList>();
  const onSubmit = async (data: Partial<NewHotel>) => {
    if (!images || images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    toast.promise(
      async () => {
        const uploadedImages = await uploadToCloudinary(images);
        const hotelData = { ...data, imageUrls: uploadedImages };
        const resp = await mutateAsync(hotelData);
        return resp;
      },
      {
        loading: "Creating hotel and uploading images...",
        success: extract_message,
        error: extract_message,
      },
    );
  };
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: Partial<NewHotel>) => {
      let resp = await apiClient.post("admins/hotels", data); // Assuming /hotels is your endpoint
      return resp.data;
    },
  });

  return (
    <div>
      <SimpleHeader title={"Create new Hotel"} />
      <div className="space-y-2">
        <h2 className="text-xl font-bold px-4">Images</h2>
        <div className=" grid grid-cols-4 gap-4 p-4">
          {images &&
            Object.values(images).map((item, index) => {
              return (
                <div key={index} className="relative h-[200px]">
                  <img
                    src={URL.createObjectURL(item)}
                    alt={`Hotel Image ${index + 1}`}
                    className="h-full w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImages((prevImages) => {
                        const newImages = new DataTransfer();
                        Array.from(prevImages || []).forEach((file) => {
                          if (file.name !== item.name) {
                            newImages.items.add(file);
                          }
                        });
                        return newImages.files;
                      });
                    }}
                    className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          <div className="h-[200px]  flex">
            <label
              htmlFor="image"
              className="size-full cursor-pointer bg-base-100 grid  ring rounded-2xl place-items-center"
            >
              Add Image
            </label>
            <input
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImages((prevImages) => {
                    const newImages = new DataTransfer();
                    Array.from(prevImages || []).forEach((file) =>
                      newImages.items.add(file),
                    );
                    Array.from(e.target.files).forEach((file) =>
                      newImages.items.add(file),
                    );
                    return newImages.files;
                  });
                }
              }}
              accept="image/*"
              type="file"
              id="image"
              className="hidden"
              name="image"
              multiple
            />
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
        <SimpleInput
          {...register("name", { required: true })}
          label="Name"
          placeholder="e.g. Grand Hyatt"
        />
        <SimpleInput
          {...register("city", { required: true })}
          label="City"
          placeholder="e.g. New York"
        />
        <SimpleInput
          {...register("state", { required: true })}
          label="State"
          placeholder="e.g. NY"
        />
        <SimpleInput
          {...register("country", { required: true })}
          label="Country"
          placeholder="e.g. USA"
        />
        {/*<SimpleInput
          {...register("address", { required: true })}
          label="Address"
          placeholder="e.g. 123 Main St"
        />*/}

        <div>
          <div className="fieldset-label mb-2">Location</div>
          <Autocomplete
            className="input w-full"
            apiKey={GOOGLE_MAPS_KEY}
            onPlaceSelected={(place: PlacesService) => {
              setValue("address", place.formatted_address);
              setValue("latitude", place.geometry.location.lat());
              setValue("longitude", place.geometry.location.lng());
              // console.log([
              //   place.geometry.location.lat(),
              //   place.address_components,
              //   place.formatted_address,
              // ]);
              // setValue("latitude",place.address_components.)
            }}
          />
        </div>

        <SimpleInput
          {...register("description", { required: true })}
          label="Description"
          placeholder="e.g. A luxurious hotel in the heart of the city."
        />
        <button
          disabled={isPending}
          type="submit"
          className="btn btn-primary w-full"
        >
          Create Hotel
        </button>
      </form>
    </div>
  );
}
