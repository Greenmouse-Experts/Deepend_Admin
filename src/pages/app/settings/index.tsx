import SimpleTitle from "@/components/SimpleTitle";
import { useState } from "react";
import Delivery from "./_components/Delivery";

export default function index() {
  const tabs = ["profile", "delivery"] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>("profile");
  return (
    <div>
      <SimpleTitle title="Settings" />
      <div className="tabs tabs-lift">
        {tabs.map((tabName) => (
          <button
            className={`tab ${tab === tabName ? "tab-active" : ""} capitalize`}
            key={tabName}
            onClick={() => setTab(tabName)}
          >
            {tabName}
          </button>
        ))}
      </div>
      <div className="">{tab === "delivery" && <Delivery />}</div>
    </div>
  );
}
