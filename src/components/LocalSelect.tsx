import { useEffect, useState, type PropsWithChildren } from "react";

interface LocalSelect<T> extends PropsWithChildren {
  options: T[]; // Changed from route to options
  value: any;
  onChange: (value: string) => void;
  label?: string;
  render: (item: T, index: number) => any;
}

export default function LocalSelect<T>(props: LocalSelect<T>) {
  const [internalValue, setInternalValue] = useState(props.value);

  useEffect(() => {
    if (internalValue !== props.value) {
      if (props.onChange) {
        props.onChange(internalValue);
      }
    }
  }, [internalValue, props.onChange, props.value]); // Added props.onChange and props.value to dependency array

  const label = props.label;
  const items: T[] = props.options ?? []; // Use props.options directly

  return (
    <div className="w-full">
      {label && (
        <label htmlFor="" className="mb-2 fieldset-label">
          {label}
        </label>
      )}
      <select
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
        }}
        className="select w-full"
      >
        {items.map((item, idx) => props.render(item, idx))}
        <>
          <option value="null">All </option>
        </>
      </select>
    </div>
  );
}
