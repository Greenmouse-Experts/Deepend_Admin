import { useState } from "react";

export const remove_nulls = <T extends object>(item: T): Partial<T> => {
  const newObject: Partial<T> = {};
  for (const key in item) {
    if (item.hasOwnProperty(key) && item[key] !== null) {
      newObject[key] = item[key];
    }
  }
  return newObject;
};

export const useSearchParams = () => {
  let [search, setSearch] = useState<string>(null);
  return { search, setSearch };
};
