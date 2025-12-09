import apiClient, { type ApiResponse } from "@/api/apiClient";
import SuspenseCompLayout from "@/components/layout/SuspenseComponentLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "@/components/SimpleInput";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import SimpleTitle from "@/components/SimpleTitle";
import { useEffect } from "react";
import ProfilePic from "./ProfilePic";
import { useImage } from "@/helpers/images";
import { uploadSingleToCloudinary } from "@/api/cloud";

interface UserProfilePayload {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  profilePicture: null | string;
}

interface UserProfileResponse {
  status: "success";
  statusCode: 200;
  message: "Request successful";
  payload: UserProfilePayload;
}

export default function UserProfile() {
  const query = useQuery<UserProfileResponse>({
    queryKey: ["get-user"],
    queryFn: async () => {
      let resp = await apiClient("auth/users/profile");
      return resp.data;
    },
  });
  useEffect(() => {
    if (query.data) {
      console.log(query.data);
      methods.reset(query.data.payload);
      image.setPrev(query.data.payload.profilePicture as any);
    }
  }, [query.data]);

  const queryClient = useQueryClient();
  const methods = useForm<UserProfilePayload>({
    defaultValues: query.data?.payload,
  });

  const mutation = useMutation({
    mutationFn: async (data: UserProfilePayload) => {
      if (image.newImage) {
        let resp = await uploadSingleToCloudinary(image.newImage);
        //@ts-ignore
        data["profilePicture"] = resp;
      }
      const resp = await apiClient.patch("auth/users/profile", data);
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
    onError: (error: any) => {
      toast.error(extract_message(error));
    },
  });

  const onSubmit = (data: UserProfilePayload) => {
    mutation.mutate(data);
  };
  //@ts-ignore
  const image = useImage(query?.data?.payload?.profilePicture || {});
  return (
    <>
      <div className=" bg-base-100 p-4 mt-4">
        <SimpleTitle title="Account Settings" />
        <SuspenseCompLayout query={query}>
          {(data) => {
            if (!data) return null;
            return (
              <>
                <div className="my-4">
                  <ProfilePic prop={image} />
                </div>
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-4 grid md:grid-cols-2 gap-2"
                  >
                    <SimpleInput
                      label="Email"
                      {...methods.register("email")}
                      type="email"
                    />
                    <SimpleInput label="Phone" {...methods.register("phone")} />
                    <SimpleInput
                      label="First Name"
                      {...methods.register("firstName")}
                    />
                    <SimpleInput
                      label="Last Name"
                      {...methods.register("lastName")}
                    />
                    <SimpleInput
                      label="Address"
                      {...methods.register("address")}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary md:col-span-2"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Saving..." : "Update Profile"}
                    </button>
                  </form>
                </FormProvider>
              </>
            );
          }}
        </SuspenseCompLayout>
      </div>{" "}
    </>
  );
}
