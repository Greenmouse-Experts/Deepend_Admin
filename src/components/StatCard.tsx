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
      className={`flex flex-col gap-2 p-4 rounded-md shadow-xl text-white`}
      style={{
        background: props.color,
      }}
    >
      <div className="flex-1">
        <h2 className="text-sm font-bold">{props.title}</h2>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold">{props.main}</h2>
        {
          <Icon
            className="
!size-10"
          />
        }
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-sm">{props.subtitle}</p>
      </div>
    </div>
  );
}
