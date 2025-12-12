import { extract_message } from "@/helpers/auth";
import { toast } from "sonner";

export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export type PlacesService = {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id: string;
  html_attributions: string[];
};

export let toast_wrapper = (fn: any, props?: { loading?: string }) => {
  const { loading } = props || {};
  const loadingMessage = loading || "requesting";
  toast.promise(() => fn(), {
    loading: loadingMessage,
    success: extract_message,
    error: extract_message,
  });
};
