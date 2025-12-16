import type { BookUser } from "@/api/types";

export default function UserBook({ item }: { item: BookUser }) {
  return (
    <div className="card bg-base-200 shadow-md p-4 rounded-box mt-4">
      <div className="flex items-center space-x-4">
        {/*<div className="flex-shrink-0">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={
                  item.profilePicture?.url || "https://via.placeholder.com/50"
                }
                alt="User Avatar"
              />
            </div>
          </div>
        </div>*/}
        <div>
          <p className="font-semibold text-base">{`${item.firstName} ${item.lastName}`}</p>
          <div className="opacity-80">
            <p className="text-sm">
              <span className="font-medium">Email:</span> {item.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Phone:</span> {item.phone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
