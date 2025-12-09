import { useImage } from "@/helpers/images";

export default function ProfilePic({
  prop,
}: {
  prop: ReturnType<typeof useImage>;
}) {
  const { image, newImage, setNew } = prop;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNew(event.target.files[0]);
    }
  };

  return (
    <div className="avatar">
      <div className="w-24 rounded-full">
        <img
          src={
            newImage ? URL.createObjectURL(newImage) : image?.url || undefined
          }
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}
