import type { QueryObserverResult } from "@tanstack/react-query";
import SimpleHeader from "../SimpleHeader";
import type { JSX } from "react/jsx-runtime";
import { extract_message } from "@/helpers/auth";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/api/apiClient";
import type React from "react";
import SimpleLoader, { SmallerLoader } from "../SimpleLoader";

interface QueryPageLayoutProps {
  query: QueryObserverResult;
  title?: string | JSX.Element;
  headerActions?: React.ReactNode | any;
  children?: React.ReactNode | ((data: any) => React.ReactNode);
  showTitle?: boolean;
  minHeight?: string;
  fillHeight?: boolean;
}

export default function SuspenseCompLayout(props: QueryPageLayoutProps) {
  const { showTitle = false } = props;
  if (props.query.isLoading)
    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className="mt-2">
          <SmallerLoader />
        </div>
      </>
    );

  if (props.query.error) {
    const error = extract_message(props.query.error as AxiosError<ApiResponse>);
    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className="p-4  grid place-items-center bg-base-300 rounded-md">
          <div className="p-4 space-y-4 ">
            <div className="text-lg text-center fieldset-label font-bold floating-label  wrap-anywhere">
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

  if (props.query.isSuccess || props.query.data)
    return (
      <>
        {showTitle && (
          <SimpleHeader title={props.title}>{props.headerActions}</SimpleHeader>
        )}
        <div className={`mt-4 ${props.fillHeight ? "h-full flex-1" : ""}`}>
          {/*//@ts-ignore*/}
          {props.children && typeof props.children === "function"
            ? props.children(props.query.data)
            : props.children}
        </div>
      </>
    );
}
