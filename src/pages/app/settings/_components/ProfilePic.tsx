import { useImage } from "@/helpers/images";

export default function ProfilePic({ src }: { src: string | undefined }) {
  const image = useImage({ path: src, url: src });
  return (
    <div className="avatar">
      <div className="w-24 rounded-full">
        <img src={src} />
      </div>
    </div>
  );
}
