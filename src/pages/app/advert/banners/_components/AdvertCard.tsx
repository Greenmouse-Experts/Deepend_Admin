import apiClient from "@/api/apiClient";
import { uploadToCloudinary } from "@/api/cloud";
import type { AdvertBanner } from "@/api/types";
import Modal from "@/components/dialogs-modals/SimpleModal";
import SimpleCarousel from "@/components/SimpleCarousel";
import SimpleInput from "@/components/SimpleInput";
import UpdateImages from "@/components/UpdateImages";
import { extract_message } from "@/helpers/auth";
import { useImages } from "@/helpers/images";
import { useModal } from "@/store/modals";
import { useMutation } from "@tanstack/react-query";
import {
  MoreVertical,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BannerCardProps {
  banner: AdvertBanner;
  refetch: () => void;
}

function BannerCard({ banner, refetch }: BannerCardProps) {
  const modal = useModal();
  const form = useForm<Partial<AdvertBanner>>({
    defaultValues: banner,
  });
  const props = useImages(banner.imageUrls);

  const mutation = useMutation({
    mutationFn: async (fn: () => Promise<any>) => await fn(),
    onSuccess: () => {
      refetch();
      modal.closeModal();
    },
    onError: (error) => {
      //@ts-ignore
      toast.error(extract_message(error));
    },
  });

  const delete_item = async () => {
    await apiClient.delete(`admins/advert-banners/${banner.id}`);
    refetch();
    return "Banner deleted successfully!";
  };

  const change_status = async () => {
    const new_status = banner.isPublished ? "unpublish" : "publish";
    await apiClient.put(`admins/advert-banners/${banner.id}/` + new_status);
    refetch();
    return `Banner ${new_status}ed successfully!`;
  };

  const update_banner_action = async (data: Partial<AdvertBanner>) => {
    let imageUrls = [...props.images];
    if (props.newImages && props.newImages.length > 0) {
      //@ts-ignore
      const newImages = await uploadToCloudinary(props.newImages);
      imageUrls = [...imageUrls, ...newImages];
    }
    const payload = {
      name: data.name,
      linkUrl: data.linkUrl,
      imageUrls: imageUrls,
    } satisfies Partial<AdvertBanner>;
    await apiClient.put(`admins/advert-banners/${banner.id}`, payload);
    return "Banner updated successfully!";
  };

  return (
    <>
      <div
        key={banner.id}
        className="card bg-base-100 shadow-xl overflow-hidden"
      >
        {banner.imageUrls && banner.imageUrls.length > 0 && (
          <SimpleCarousel>
            {banner.imageUrls.map((url) => (
              <img
                loading="lazy"
                key={url.url + "item"}
                src={url.url}
                alt={banner.name}
                className="w-full h-[220px] object-cover"
              />
            ))}
          </SimpleCarousel>
        )}
        <div className="card-body p-4">
          <div className="flex justify-between items-start">
            <h2 className="card-title text-lg font-semibold">{banner.name}</h2>
            <div className="dropdown dropdown-end dropdown-top">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Actions"
              >
                <MoreVertical size={20} />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button
                    disabled={mutation.isPending}
                    onClick={() => {
                      toast.promise(mutation.mutateAsync(change_status), {
                        loading: "Changing...",
                        success: (message) => message,
                        error: (error) => extract_message(error),
                      });
                    }}
                    className={
                      banner.isPublished ? "text-warning" : "text-success"
                    }
                  >
                    {banner.isPublished ? (
                      <ToggleLeft size={20} />
                    ) : (
                      <ToggleRight size={20} />
                    )}
                    {banner.isPublished ? "Unpublish" : "Publish"}
                  </button>
                </li>
                <li>
                  <button
                    disabled={mutation.isPending}
                    onClick={() => {
                      props.setPrev(banner.imageUrls);
                      modal.showModal();
                    }}
                    className="text-info"
                  >
                    <Pencil size={20} />
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    disabled={mutation.isPending}
                    onClick={() => {
                      toast.promise(mutation.mutateAsync(delete_item), {
                        loading: "Deleting...",
                        success: (message) => message,
                        error: (error) => extract_message(error),
                      });
                    }}
                    className="text-error"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-base-content/80">
            Status:{" "}
            <span
              className={`badge badge-sm ${
                banner.isPublished ? "badge-success" : "badge-warning"
              }`}
            >
              {banner.isPublished ? "Published" : "Not Published"}
            </span>
          </p>
          {banner.linkUrl && (
            <div className="flex items-center gap-2 text-sm text-base-content/80">
              <span>Link:</span>
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-primary truncate"
                title={banner.linkUrl} // Add title for full URL on hover
              >
                {banner.linkUrl}
              </a>
            </div>
          )}
        </div>
      </div>
      <Modal ref={modal.ref}>
        <form
          className="space-y-4 gap-4"
          onSubmit={form.handleSubmit((data) => {
            toast.promise(
              mutation.mutateAsync(() => update_banner_action(data)),
              {
                loading: "Updating...",
                success: (message) => message,
                error: (error) => extract_message(error),
              },
            );
          })}
        >
          <h2 className="text-xl font-bold">Edit Banner</h2>
          <SimpleInput {...form.register("name")} label="Name" />
          <SimpleInput {...form.register("linkUrl")} label="Link URL" />
          <UpdateImages {...props} />
          <div className="card-actions">
            <button
              disabled={mutation.isPending}
              className="btn  btn-primary ml-auto"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default function Banner(banner: AdvertBanner & { refetch: () => void }) {
  return <BannerCard banner={banner} refetch={banner.refetch} />;
}
