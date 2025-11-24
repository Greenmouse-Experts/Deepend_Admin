export interface ApiResponse<T = any> {
  message: string;
  payload: T;
  status: string;
  statusCode: number;
}

// export default apiClient;

import axios from "axios";
import { get_user_value, set_user_value, clear_user } from "@/store/authStore";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: "https://deepend-api.onrender.com/api/v1/",
  withCredentials: true,
});

// Attach access token before each request
apiClient.interceptors.request.use((config) => {
  const token = get_user_value()?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single simple refresh handler
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If token expired and not already retried
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const user = get_user_value();
        const { data } = await axios.post(
          "https://deepend-api.onrender.com/api/v1/auth/users/refresh-token",
          { userId: user.id },
        );
        const payload = data.payload;
        const newUser = { ...payload, access_token: payload.access_token };
        set_user_value(newUser);

        // Update header and retry
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch {
        clear_user();
        toast.info("Session expired. Please log in again.", { duration: 1500 });
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
