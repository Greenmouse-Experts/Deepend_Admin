import SimpleInput from "@/components/SimpleInput";
import SimpleTitle from "@/components/SimpleTitle";
import { useForm, Controller } from "react-hook-form";
import SimpleSelect from "@/components/SimpleSelect";
import { type Cinema, type MovieObject } from "@/api/types";
import SimpleTextArea from "@/components/SimpleTextArea";
import ImageUpload from "@/components/uploaders/ImageUpload";
import { useImage } from "@/helpers/images";
import { useMutation } from "@tanstack/react-query";
import apiClient, { type ApiResponse } from "@/api/apiClient";
import { uploadSingleToCloudinary } from "@/api/cloud";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import { useNavigate } from "@tanstack/react-router";

type FormType = Omit<
  MovieObject,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "genres"
  | "posterUrl"
  | "posterPath"
  | "trailerUrl"
  | "trailerPath"
> & {
  cinemaId: string;
  genres: string[];
  posterUrl?: string;
  posterPath?: string;
  trailerUrl?: string;
  trailerPath?: string;
};

export default function index() {
  const form = useForm<FormType>();
  const nav = useNavigate();
  const {
    images: posterImage,
    setPrev: setPrevPosterImage,
    newImages: newPosterImage,
    setNew: setNewPosterImage,
  } = useImage(undefined);
  const {
    images: trailerImage,
    setPrev: setPrevTrailerImage,
    newImages: newTrailerImage,
    setNew: setNewTrailerImage,
  } = useImage(undefined);

  const mutate = useMutation({
    mutationFn: async (data: FormType) => {
      let posterUploadResult = { url: "", path: "" };
      let trailerUploadResult = { url: "", path: "" };

      if (newPosterImage) {
        posterUploadResult = await uploadSingleToCloudinary(newPosterImage);
      } else if (posterImage) {
        posterUploadResult = posterImage;
      }

      if (newTrailerImage) {
        trailerUploadResult = await uploadSingleToCloudinary(newTrailerImage);
      } else if (trailerImage) {
        trailerUploadResult = trailerImage;
      }

      const movieData = {
        ...data,
        posterUrl: posterUploadResult.url,
        posterPath: posterUploadResult.path,
        trailerUrl: trailerUploadResult.url,
        trailerPath: trailerUploadResult.path,
      };
      let resp = await apiClient.post("admins/movies", movieData);
      return resp.data;
    },
    onSuccess: (data: ApiResponse) => {
      form.reset();
      nav({ to: "/app/cinema/movies/" + data.payload.id });
      setPrevPosterImage(undefined);
      setNewPosterImage(undefined);
      setPrevTrailerImage(undefined);
      setNewTrailerImage(undefined);
    },
    onError: (error) => {
      console.error("Error creating movie:", error);
    },
  });

  const onSubmit = async (data: FormType) => {
    toast.promise(() => mutate.mutateAsync(data), {
      loading: "loading",
      success: "success",
      error: extract_message,
    });
  };

  return (
    <div>
      <SimpleTitle title="New Movie" />
      <div className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="cinemaId"
            control={form.control}
            rules={{ required: "Cinema is required" }}
            render={({ field }) => (
              <SimpleSelect<Cinema>
                label="Cinema"
                route="/admins/cinemas"
                value={field.value}
                onChange={field.onChange}
                render={(item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                )}
              />
            )}
          />
          <SimpleInput
            label="Title"
            {...form.register("title", { required: "Title is required" })}
            placeholder="Movie Title"
          />
          <SimpleTextArea
            label="Description"
            {...form.register("description", {
              required: "Description is required",
            })}
            placeholder="Movie Description"
          />
          <SimpleInput
            label="Cast"
            {...form.register("cast", {
              required: "Cast is required",
            })}
            placeholder="Actor 1, Actor 2, ..."
          />
          <SimpleInput
            label="Duration (minutes)"
            type="number"
            {...form.register("durationMinutes", {
              required: "Duration is required",
              valueAsNumber: true,
            })}
            placeholder="e.g., 120"
          />
          <SimpleInput
            label="Age Rating"
            type="number"
            {...form.register("ageRating", {
              required: "Age rating is required",
              // valueAsNumber: true,
            })}
            placeholder="e.g., 13"
          />
          <div>
            <label className="mb-2 fieldset-label">Poster Image</label>
            <ImageUpload
              image={posterImage}
              setNew={setNewPosterImage}
              setPrev={setPrevPosterImage}
            />
          </div>
          <div>
            <label className="mb-2 fieldset-label">Trailer Image</label>
            <ImageUpload
              image={trailerImage}
              setNew={setNewTrailerImage}
              setPrev={setPrevTrailerImage}
            />
          </div>
          {/* Add genre selection here, possibly using a multi-select or multiple SimpleSelect components */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={mutate.isPending}
            >
              Create Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
