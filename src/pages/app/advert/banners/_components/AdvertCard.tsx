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

export default function Banner(banner: AdvertBanner) {
  const mutation = useMutation({
    mutationFn: async (fn: any) => await fn(),
    onSuccess: () => {
      //@ts-ignore
      banner.refetch();
      modal.closeModal();
    },
  });
  const delete_item = async () => {
    let resp = await apiClient.delete(`admins/advert-banners/${banner.id}`);
    //@ts-ignore
    banner.refetch();
    return resp.data;
  };
  const change_status = async () => {
    const new_status = banner.isPublished ? "unpublish" : "publish";
    let resp = await apiClient.put(
      `admins/advert-banners/${banner.id}/` + new_status,
    );
    //@ts-ignore
    banner.refetch();
    return resp.data;
  };
  const modal = useModal();
  const form = useForm<Partial<AdvertBanner>>({
    defaultValues: banner,
  });
  const props = useImages(banner.imageUrls);
  const action = async (data: Partial<AdvertBanner>) => {
    console.log(props.images);
    let imageUrls = [...props.images];
    if (props.newImages) {
      //@ts-expect-error
      const newImages = await uploadToCloudinary(props.newImages);
      imageUrls = [...imageUrls, ...newImages];
    }
    const payload = {
      name: data.name,
      linkUrl: data.linkUrl,
      imageUrls: imageUrls,
    } satisfies Partial<AdvertBanner>;
    const resp = await apiClient.put(
      `admins/advert-banners/${banner.id}`,
      payload,
    );
    return resp.data;
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
              <button
                disabled={mutation.isPending}
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Actions"
              >
                <MoreVertical size={20} />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content ring ring-current/20 z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52"
              >
                <li
                  onClick={() => {
                    toast.promise(mutation.mutateAsync(change_status), {
                      loading: "Changing...",
                      success: extract_message,
                      error: extract_message,
                    });
                  }}
                >
                  <a
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
                  </a>
                </li>
                <li
                  onClick={() => {
                    props.setPrev(banner.imageUrls);
                    modal.showModal();
                  }}
                >
                  <a className="text-info">
                    <Pencil size={20} />
                    Edit
                  </a>
                </li>
                <li
                  onClick={() => {
                    toast.promise(delete_item, {
                      loading: "Deleting...",
                      success: "Deleted!",
                      error: extract_message,
                    });
                  }}
                >
                  <a className="text-error">
                    <Trash2 size={20} />
                    Delete
                  </a>
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
            <p className="text-sm text-base-content/80">
              Link:{" "}
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover text-primary"
              >
                {banner.linkUrl}
              </a>
            </p>
          )}
        </div>
      </div>
      <Modal ref={modal.ref}>
        <form
          className="space-y-4 gap-4"
          onSubmit={form.handleSubmit((data) => {
            toast.promise(
              mutation.mutateAsync(() => action(data)),
              {
                loading: "Updating...",
                success: "Updated!",
                error: extract_message,
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
