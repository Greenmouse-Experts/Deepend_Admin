import apiClient, { type ApiResponse } from "@/api/apiClient";
import { uploadSingleToCloudinary } from "@/api/cloud";
import type { MovieObject } from "@/api/types";
import SuspensePageLayout from "@/components/layout/SuspensePageLayout";
import SimpleInput from "@/components/SimpleInput";
import SimpleSelect from "@/components/SimpleSelect";
import SimpleTextArea from "@/components/SimpleTextArea";
import SimpleTitle from "@/components/SimpleTitle";
import ImageUpload from "@/components/uploaders/ImageUpload";
import { extract_message } from "@/helpers/auth";
import { useImage } from "@/helpers/images";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function index() {
  const { id } = useParams({
    strict: false,
  });
  const query = useQuery<ApiResponse<MovieObject>>({
    queryKey: ["movie", id],
    queryFn: async () => {
      let resp = await apiClient.get("admins/movies/" + id);
      return resp.data;
    },
  });
  return (
    <>
      <SuspensePageLayout query={query}>
        {(data) => {
          let payload = data.payload;
          return (
            <>
              <EditForm data={payload} />
            </>
          );
        }}
      </SuspensePageLayout>
    </>
  );
}

const EditForm = ({ data }: { data: MovieObject }) => {
  const form = useForm<MovieObject>({
    defaultValues: data,
  });
  const nav = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: async (updatedData: MovieObject) => {
      let trailerUrl = updatedData.trailerUrl;
      let trailerPath = updatedData.trailerPath;
      let posterUrl = updatedData.posterUrl;
      let posterPath = updatedData.posterPath;

      if (trailer_props.newImage) {
        const trailer = await uploadSingleToCloudinary(trailer_props.newImage);
        trailerUrl = trailer.url;
        trailerPath = trailer.path;
      }
      if (poster_props.newImage) {
        const poster = await uploadSingleToCloudinary(poster_props.newImage);
        posterUrl = poster.url;
        posterPath = poster.path;
      }

      const new_data: MovieObject = {
        ...updatedData,
        posterPath,
        trailerPath,
        posterUrl,
        trailerUrl,
      };
      delete new_data.id;
      delete new_data.createdAt;
      delete new_data.updatedAt;
      delete new_data.genres;
      let resp = await apiClient.put(`admins/movies/${data.id}`, new_data);
      return resp.data;
    },
    onSuccess: (resp: ApiResponse<{ id: string }>) => {
      toast.success("Movie updated successfully!");
      nav({
        to: `/app/cinema/movies/${data.id}`,
      });
    },
    onError: (error) => {
      toast.error(extract_message(error as any));
    },
  });

  const trailer_props = useImage({
    url: data.trailerUrl,
    path: data.trailerPath,
  });
  const poster_props = useImage({ url: data.posterUrl, path: data.posterPath });

  return (
    <div>
      <SimpleTitle title="Edit Movie" />
      <FormProvider {...form}>
        <form
          className="py-4 space-y-6"
          onSubmit={form.handleSubmit((formData) => {
            toast.promise(mutateAsync(formData), {
              loading: "Updating movie...",
              success: "Movie updated!",
              error: (err) => extract_message(err),
            });
          })}
        >
          <div>
            <h2 className="fieldset-label">Poster</h2>
            <ImageUpload {...poster_props}></ImageUpload>
          </div>
          <div>
            <h2 className="fieldset-label">Trailer</h2>
            <ImageUpload {...trailer_props}></ImageUpload>
          </div>
          <SimpleSelect
            label="Cinema"
            value={form.getValues("cinemaId")}
            onChange={(value) => form.setValue("cinemaId", value)}
            route="admins/cinemas"
            render={(item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            )}
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
            Update Movie
          </button>
        </form>
      </FormProvider>
    </div>
  );
};
