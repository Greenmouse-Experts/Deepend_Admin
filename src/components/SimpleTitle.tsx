import React, { forwardRef } from "react";

const SimpleTitle = forwardRef<HTMLDivElement, { title?: string }>(
  ({ title = "Settings" }, ref) => {
    return (
      <div
        ref={ref}
        className="text-xl flex-1 font-bold py-2 divider divider-start"
      >
        {title}
      </div>
    );
  },
);

export default SimpleTitle;
