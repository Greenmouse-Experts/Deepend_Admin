import { useForm, FormProvider } from "react-hook-form";
import SimpleInput from "@/components/SimpleInput";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";
import UserProfile from "./UserDetails";

export default function ProfileSettings() {
  const methods = useForm<{
    currentPassword: string;
    newPassword: string;
  }>();
  const { register, handleSubmit } = methods;

  const onSubmit = (data: { currentPassword: string; newPassword: string }) => {
    console.log(data);
    toast.promise(mutateAsync(data as any), {
      loading: "loading",
      success: "success",
      error: extract_message,
    });
    // Handle password change logic here
  };
  const { mutateAsync } = useMutation({
    mutationFn: async (data) => {
      let resp = await apiClient.post("auth/users/change-password", data);
      return resp.data;
    },
  });

  return (
    <>
      <UserProfile />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 bg-base-100 mt-4 rounded-md"
        >
          <SimpleInput
            label="Current Password"
            type="password"
            {...register("currentPassword")}
          />
          <SimpleInput
            label="New Password"
            type="password"
            {...register("newPassword")}
          />
          <button type="submit" className="btn btn-primary w-full">
            Change Password
          </button>
        </form>
      </FormProvider>
    </>
  );
}
