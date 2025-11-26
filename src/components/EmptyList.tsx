export default function EmptyList({ list }: { list: any[] }) {
  if (list.length > 0) {
    return null;
  }
  return (
    <div className="h-12 justify-center flex items-center bg-base-100  w-full">
      <span>Empty List / No Data</span>
    </div>
  );
}
