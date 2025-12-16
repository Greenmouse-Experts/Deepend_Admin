import type { BookUser } from "@/api/types";

export default function UserBook({ item }: { item: BookUser }) {
  return (
    <div className="p-2 bg-base-300 ring ring-current/20 rounded-box  mt-auto">
      <div className=" fieldset-label ">User</div>

      <div>
        <p className="font-semibold text-sm">{`${item.firstName} ${item.lastName}`}</p>
        <div className="opacity-80">
          <p className="text-info text-sm">{item.email}</p>
          <p className="text-info text-sm">{item.phone}</p>
        </div>
      </div>
    </div>
  );
}
