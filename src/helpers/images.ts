import { useEffect, useState } from "react";

export const useImages = (prevImages?: { url: string; path: string }[]) => {
  const [images, setPrev] = useState(prevImages);
  const [newImages, setNew] = useState<any[]>();
  useEffect(() => {
    console.log("images changed");
  }, [images]);
  return { images, setPrev, newImages, setNew };
};
