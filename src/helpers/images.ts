import { useEffect, useState } from "react";

export const useImages = (prevImages?: { url: string; path: string }[]) => {
  const [images, setPrev] = useState(prevImages);
  const [newImages, setNew] = useState<any[]>();

  return { images, setPrev, newImages, setNew };
};
