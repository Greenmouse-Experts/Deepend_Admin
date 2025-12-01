import React from "react";
import type { JSX } from "react/jsx-runtime";

export interface StatCardProps {
  title: string;
  color: string;
  Icon: JSX.Element | React.ReactNode | any;
  subtitle: string;
  main: string;
}

export default function StatCard(props: StatCardProps) {
  const { Icon } = props;
  return (
    <div
      className={`flex  gap-2 p-4 rounded-md shadow-xl bg-current/50`}
      style={{
        background: props.color,
      }}
    >
      <div>
        {" "}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-wrap break-words font-bold">
            {props.main}
          </h2>
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-bold">{props.title}</h2>
          <p className="fieldset-label text-sm font-bold">{props.subtitle}</p>
        </div>
      </div>
      <div className="">{<Icon className="!size-10" />}</div>
    </div>
  );
}
