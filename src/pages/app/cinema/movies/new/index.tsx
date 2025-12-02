import apiClient, { type ApiResponse } from "@/api/apiClient";
import { uploadSingleToCloudinary } from "@/api/cloud";
import type { MovieCinema } from "@/api/types";
import SimpleInput from "@/components/SimpleInput";
import SimpleSelect from "@/components/SimpleSelect";
import SimpleTextArea from "@/components/SimpleTextArea";
import SimpleTitle from "@/components/SimpleTitle";
import ImageUpload from "@/components/uploaders/ImageUpload";
import { extract_message } from "@/helpers/auth";
import { useImage } from "@/helpers/images";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface MovieType extends Omit<MovieCinema, "id"> {
  //
}
export default function index() {
  const form = useForm<MovieType>();
  const nav = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: any) => {
      if (!trailer_props.newImage || !poster_props.newImage) {
        throw new Error("Please upload both trailer and poster images");
      }
      const trailer = await uploadSingleToCloudinary(trailer_props.newImage);
      const poster = await uploadSingleToCloudinary(poster_props.newImage);
      const new_data: MovieCinema = {
        ...data,
        posterPath: poster.path,
        trailerPath: trailer.path,
        posterUrl: poster.url,
        trailerUrl: trailer.url,
      };
      let resp = await apiClient.post("admins/movies", new_data);
      return resp.data;
    },
    onSuccess: (data: ApiResponse<{ id: string }>) => {
      nav({
        to: `/app/cinema/movies/${data.payload.id}`,
      });
    },
  });
  const trailer_props = useImage(null);
  const poster_props = useImage(null);
  return (
    <div>
      <SimpleTitle title="Add Cinema" />
      <FormProvider {...form}>
        <form
          className="py-4 space-y-6"
          onSubmit={form.handleSubmit((data) => {
            console.log(data);
            toast.promise(mutateAsync(data), {
              loading: "loading",
              success: "success",
              error: extract_message,
            });
          })}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div>
              <h2 className="fieldset-label">Poster</h2>
              <ImageUpload {...poster_props}></ImageUpload>
            </div>
            <div>
              <h2 className="fieldset-label">Trailer</h2>
              <ImageUpload {...trailer_props}></ImageUpload>
            </div>
          </div>
          <SimpleSelect
            label="Cinema"
            value={form.getValues("cinemaId")}
            // value={field.value}
            onChange={(value) => form.setValue("cinemaId", value)}
            route="admins/cinemas"
            render={(item: any, index) => {
              if (index === 0) {
                form.setValue("cinemaId", item.id);
                return <option value={item.id}>{item.name}</option>;
              }
              return <option value={item.id}> {item.name}</option>;
            }}
          ></SimpleSelect>
          <SimpleInput label="Title" {...form.register("title")} />
          <SimpleTextArea
            label="Description"
            {...form.register("description")}
          />
          <SimpleInput label="Cast" {...form.register("cast")} />
          <SimpleInput
            label="Duration (Minutes)"
            type="number"
            {...form.register("durationMinutes", { valueAsNumber: true })}
          />
          <SimpleInput
            label="Age Rating"
            type="number"
            {...form.register("ageRating", { valueAsNumber: true })}
          />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
