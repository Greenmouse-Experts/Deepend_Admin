import apiClient from "@/api/apiClient";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import SimpleInput from "@/components/SimpleInput";
import { useImage } from "@/helpers/images";
import { uploadSingleToCloudinary, uploadToCloudinary } from "@/api/cloud";
import SimpleTitle from "@/components/SimpleTitle";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import { useNavigate } from "@tanstack/react-router";
import UpdateImages from "@/components/UpdateImages"; // Import UpdateImages

export default function index() {
  const { image, newImage, setPrev, setNew } = useImage(undefined);
  const nav = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: {
      name: string;
      imageUrls: { path: string; url: string };
      linkUrl: string;
    }) => {
      if (newImage) {
        const uploadedImage = await uploadToCloudinary(newImage);
        //@ts-ignore
        data["imageUrls"] = [...uploadedImage];
      }
      let resp = await apiClient.post("admins/advert-banners", data);
      return resp.data;
    },
    onSuccess: () => {
      nav({ to: "/app/advert/banners" });
    },
  });
  const form = useForm<{
    name: string;
    imageUrls: {
      path: string;
      url: string;
    };
    linkUrl: string;
  }>();

  const onSubmit = form.handleSubmit(async (data) => {
    toast.promise(mutateAsync(data), {
      loading: "Uploading...",
      success: "Banner created successfully",
      error: extract_message,
    });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="p-4 space-y-4">
        <SimpleTitle title="Create New Advert Banner" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {/* Use UpdateImages component */}
          <UpdateImages
            images={image ? [image] : []}
            setNew={setNew}
            setPrev={setPrev}
          />
        </div>
        <SimpleInput
          label="Name"
          {...form.register("name")}
          placeholder="Banner Name"
        />
        <SimpleInput
          label="Link URL"
          {...form.register("linkUrl")}
          placeholder="https://example.com"
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
