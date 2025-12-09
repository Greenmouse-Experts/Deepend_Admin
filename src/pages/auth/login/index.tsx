import apiClient, { type ApiResponse } from "@/api/apiClient";
import SimpleInput from "@/components/SimpleInput";
import { extract_message } from "@/helpers/auth";
import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
export default function index() {
  const [user, setUser] = useAuth();
  const nav = useNavigate();
  const form = useForm();
  const onsubmit = (data: any) => {
    console.log(data);
    //@ts-ignore
    toast.promise(() => mutation.mutateAsync(data), {
      loading: "Logging in...",
      success: extract_message,
      error: extract_message,
    });
  };
  const mutation = useMutation({
    mutationFn: async (data) => {
      const resp = await apiClient.post("auth/admins/login", data);
      return resp.data;
    },
    onSuccess: (data: ApiResponse) => {
      setUser(data.payload);
      console.log(data);
      nav({ to: "/app" });
    },
  });
  return (
    <div className="hero min-h-screen bg-base-200 flex">
      <div className="flex-1 grid place-items-center m-4 md:m-0  ">
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          action=""
          className="w-full p-6 rounded-lg bg-base-100 shadow  space-y-4 max-w-xl"
        >
          <img
            className="h-22 mx-auto"
            src="https://deependapp.com.ng/assets/images/deep.png"
            alt=""
          />
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <SimpleInput {...form.register("email")} label="Email" />
          <SimpleInput
            {...form.register("password")}
            label="Password"
            type="password"
          />
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
