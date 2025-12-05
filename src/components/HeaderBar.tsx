import { useAuth } from "@/store/authStore";
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import SideBarMenu from "./menus-buttons/SideBarMenu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { toast } from "sonner";
import { extract_message } from "@/helpers/auth";

export default function HeaderBar() {
  const [user, setUser] = useAuth();
  const nav = useNavigate();
  const logout = useMutation({
    mutationFn: async () => {
      let resp = await apiClient.put("/auth/users/logout");
      return resp.data;
    },
    onSuccess: () => {
      setUser(null);
      nav({
        to: "/auth/login",
      });
    },
  });
  return (
    <div className="h-20 p-6 flex justify-end items-center bg-base-100 shadow-md">
      <div className="mr-auto lg:hidden">
        <SideBarMenu />
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/app/notifications" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <Bell size={24} />
            {/*<span className="badge badge-xs badge-primary indicator-item"></span>*/}
          </div>
        </Link>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={`https://ui-avatars.com/api/?name=Admin&background=random`}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content space-y-4 py-4 mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                <UserIcon size={18} />
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>
                <Settings size={18} />
                Settings
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  toast.promise(logout.mutateAsync, {
                    loading: "Logging out...",
                    success: extract_message,
                    error: extract_message,
                  });
                }}
              >
                <LogOut size={18} />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
