// import { Outlet } from "@tanstack/react-router";

// const tabs = [
//   {
//     name: "Delivery Settings",
//     path: "/app/settings/delivery",
//   },
// ];
// export default function index() {
//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold py-2">Settings</h2>
//       <ul className="menu menu-horizontal bg-base-300 rounded-box">
//         {tabs.map((tab) => {
//           const currentLocation = window.location.pathname;
//           if (tab.path == currentLocation) {
//             return (
//               <>
//                 <li key={tab.name}>
//                   <a
//                     href={tab.path}
//                     className="text-base p-2 bg-primary/10 text-primary"
//                   >
//                     {tab.name}
//                   </a>
//                 </li>
//               </>
//             );
//           }
//           return (
//             <>
//               <li key={tab.name}>
//                 <a href={tab.path} className="text-base p-2">
//                   {tab.name}
//                 </a>
//               </li>
//             </>
//           );
//         })}
//       </ul>
//       <section className="mt-6">
//         <Outlet />
//       </section>
//     </div>
//   );
// }
