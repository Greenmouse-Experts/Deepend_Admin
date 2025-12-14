import type { QueryObserverResult } from "@tanstack/react-query";
import SimpleHeader from "../SimpleHeader";
import type { JSX } from "react/jsx-runtime";
import { extract_message } from "@/helpers/auth";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/apiClient";
import type React from "react";
import SimpleLoader from "../SimpleLoader";
import { useEffect } from "react";

interface QueryPageLayoutProps<TData> {
  query: QueryObserverResult<TData>;
  title?: string | JSX.Element;
  headerActions?: React.ReactNode;
  children?: React.ReactNode | ((data: TData) => React.ReactNode);
  showTitle?: boolean;
}

export default function SuspensePageLayout<TData>(
  props: QueryPageLayoutProps<TData>,
) {
  const { showTitle = true } = props;
  useEffect(() => {
    console.log("useEffect called");
  }, [props.query.isError]);
  if (props.query.isLoading)
    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className="mt-2">
          <SimpleLoader />
        </div>
      </>
    );

  if (props.query.isError) {
    const error = extract_message(props.query.error as AxiosError<ApiResponse>);

    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className="p-4 min-h-[520px] grid place-items-center bg-base-300 rounded-md">
          <div className="p-4 space-y-4">
            <div className="text-lg text-center fieldset-label font-bold wrap-anywhere">
              {error}
            </div>
            <button
              className="btn btn-error btn-block"
              onClick={() => props.query.refetch()}
            >
              Reload
            </button>
          </div>
        </div>
      </>
    );
  }

  if (props.query.isSuccess && props.query.data)
    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className="mt-4 min-h-[520px]">
          {typeof props.children === "function"
            ? props.children(props.query.data) // ✅ fully inferred
            : props.children}
        </div>
      </>
    );

  return null;
}
