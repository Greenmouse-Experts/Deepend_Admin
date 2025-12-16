// Generouted, changes to this file will be overridden
import { Fragment } from "react";
import {
  Outlet,
  RouterProvider,
  createLazyRoute,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import App from "./pages/_app";

const root = createRootRoute({ component: App || Outlet });
const _404 = createRoute({
  getParentRoute: () => root,
  path: "*",
  component: Fragment,
});
const privacy = createRoute({ getParentRoute: () => root, path: "privacy" });
const privacyindex = createRoute({
  getParentRoute: () => privacy,
  path: "/",
}).lazy(() =>
  import("./pages/privacy/index").then((m) =>
    createLazyRoute("/privacy")({ component: m.default }),
  ),
);
const auth = createRoute({ getParentRoute: () => root, path: "auth" }).lazy(
  () =>
    import("./pages/auth/_layout").then((m) =>
      createLazyRoute("/auth")({ component: m.default }),
    ),
);
const authlogin = createRoute({ getParentRoute: () => auth, path: "login" });
const authloginindex = createRoute({
  getParentRoute: () => authlogin,
  path: "/",
}).lazy(() =>
  import("./pages/auth/login/index").then((m) =>
    createLazyRoute("/auth/login")({ component: m.default }),
  ),
);
const app = createRoute({
  getParentRoute: () => root,
  path: "app",
  // @ts-ignore
  loader: (...args) =>
    import("./pages/app/_layout").then((m) => m.Loader(...args)),
}).lazy(() =>
  import("./pages/app/_layout").then((m) =>
    createLazyRoute("/app")({ component: m.default }),
  ),
);
const appvr = createRoute({ getParentRoute: () => app, path: "vr" });
const appvrpurchases = createRoute({
  getParentRoute: () => appvr,
  path: "purchases",
});
const appvrpurchasesindex = createRoute({
  getParentRoute: () => appvrpurchases,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/purchases/index").then((m) =>
    createLazyRoute("/app/vr/purchases")({ component: m.default }),
  ),
);
const appvrindex = createRoute({ getParentRoute: () => appvr, path: "/" }).lazy(
  () =>
    import("./pages/app/vr/index").then((m) =>
      createLazyRoute("/app/vr")({ component: m.default }),
    ),
);
const appvrgames = createRoute({ getParentRoute: () => appvr, path: "games" });
const appvrgamesnew = createRoute({
  getParentRoute: () => appvrgames,
  path: "new",
});
const appvrgamesnewindex = createRoute({
  getParentRoute: () => appvrgamesnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/games/new/index").then((m) =>
    createLazyRoute("/app/vr/games/new")({ component: m.default }),
  ),
);
const appvrgamesindex = createRoute({
  getParentRoute: () => appvrgames,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/games/index").then((m) =>
    createLazyRoute("/app/vr/games")({ component: m.default }),
  ),
);
const appvrgamesgameId = createRoute({
  getParentRoute: () => appvrgames,
  path: "$gameId",
});
const appvrgamesgameIdindex = createRoute({
  getParentRoute: () => appvrgamesgameId,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/games/[gameId]/index").then((m) =>
    createLazyRoute("/app/vr/games/$gameId")({ component: m.default }),
  ),
);
const appvrgamesgameIdedit = createRoute({
  getParentRoute: () => appvrgamesgameId,
  path: "edit",
});
const appvrgamesgameIdeditindex = createRoute({
  getParentRoute: () => appvrgamesgameIdedit,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/games/[gameId]/edit/index").then((m) =>
    createLazyRoute("/app/vr/games/$gameId/edit")({ component: m.default }),
  ),
);
const appvrcategories = createRoute({
  getParentRoute: () => appvr,
  path: "categories",
});
const appvrcategoriesindex = createRoute({
  getParentRoute: () => appvrcategories,
  path: "/",
}).lazy(() =>
  import("./pages/app/vr/categories/index").then((m) =>
    createLazyRoute("/app/vr/categories")({ component: m.default }),
  ),
);
const appusers = createRoute({ getParentRoute: () => app, path: "users" });
const appusersindex = createRoute({
  getParentRoute: () => appusers,
  path: "/",
}).lazy(() =>
  import("./pages/app/users/index").then((m) =>
    createLazyRoute("/app/users")({ component: m.default }),
  ),
);
const appusersid = createRoute({ getParentRoute: () => appusers, path: "$id" });
const appusersidindex = createRoute({
  getParentRoute: () => appusersid,
  path: "/",
}).lazy(() =>
  import("./pages/app/users/[id]/index").then((m) =>
    createLazyRoute("/app/users/$id")({ component: m.default }),
  ),
);
const apptest = createRoute({ getParentRoute: () => app, path: "test" });
const apptestindex = createRoute({
  getParentRoute: () => apptest,
  path: "/",
}).lazy(() =>
  import("./pages/app/test/index").then((m) =>
    createLazyRoute("/app/test")({ component: m.default }),
  ),
);
const appstudio = createRoute({ getParentRoute: () => app, path: "studio" });
const appstudioindex = createRoute({
  getParentRoute: () => appstudio,
  path: "/",
  // @ts-ignore
  loader: (...args) =>
    import("./pages/app/studio/index").then((m) => m.Loader(...args)),
}).lazy(() =>
  import("./pages/app/studio/index").then((m) =>
    createLazyRoute("/app/studio")({ component: m.default }),
  ),
);
const appstudioall = createRoute({
  getParentRoute: () => appstudio,
  path: "all",
});
const appstudioallindex = createRoute({
  getParentRoute: () => appstudioall,
  path: "/",
}).lazy(() =>
  import("./pages/app/studio/all/index").then((m) =>
    createLazyRoute("/app/studio/all")({ component: m.default }),
  ),
);
const appstudioid = createRoute({
  getParentRoute: () => appstudio,
  path: "$id",
});
const appstudioidindex = createRoute({
  getParentRoute: () => appstudioid,
  path: "/",
}).lazy(() =>
  import("./pages/app/studio/[id]/index").then((m) =>
    createLazyRoute("/app/studio/$id")({ component: m.default }),
  ),
);
const appsettings = createRoute({
  getParentRoute: () => app,
  path: "settings",
});
const appsettingsprofile = createRoute({
  getParentRoute: () => appsettings,
  path: "profile",
});
const appsettingsprofileindex = createRoute({
  getParentRoute: () => appsettingsprofile,
  path: "/",
}).lazy(() =>
  import("./pages/app/settings/profile/index").then((m) =>
    createLazyRoute("/app/settings/profile")({ component: m.default }),
  ),
);
const appsettingsindex = createRoute({
  getParentRoute: () => appsettings,
  path: "/",
}).lazy(() =>
  import("./pages/app/settings/index").then((m) =>
    createLazyRoute("/app/settings")({ component: m.default }),
  ),
);
const appsettingsdelivery = createRoute({
  getParentRoute: () => appsettings,
  path: "delivery",
});
const appsettingsdeliverynew = createRoute({
  getParentRoute: () => appsettingsdelivery,
  path: "new",
});
const appsettingsdeliverynewindex = createRoute({
  getParentRoute: () => appsettingsdeliverynew,
  path: "/",
}).lazy(() =>
  import("./pages/app/settings/delivery/new/index").then((m) =>
    createLazyRoute("/app/settings/delivery/new")({ component: m.default }),
  ),
);
const appsettingsdeliveryindex = createRoute({
  getParentRoute: () => appsettingsdelivery,
  path: "/",
}).lazy(() =>
  import("./pages/app/settings/delivery/index").then((m) =>
    createLazyRoute("/app/settings/delivery")({ component: m.default }),
  ),
);
const appnotifications = createRoute({
  getParentRoute: () => app,
  path: "notifications",
});
const appnotificationsindex = createRoute({
  getParentRoute: () => appnotifications,
  path: "/",
}).lazy(() =>
  import("./pages/app/notifications/index").then((m) =>
    createLazyRoute("/app/notifications")({ component: m.default }),
  ),
);
const appindex = createRoute({ getParentRoute: () => app, path: "/" }).lazy(
  () =>
    import("./pages/app/index").then((m) =>
      createLazyRoute("/app")({ component: m.default }),
    ),
);
const apphotel = createRoute({ getParentRoute: () => app, path: "hotel" });
const apphotelroom = createRoute({
  getParentRoute: () => apphotel,
  path: "room",
});
const apphotelroomid = createRoute({
  getParentRoute: () => apphotelroom,
  path: "$id",
});
const apphotelroomidindex = createRoute({
  getParentRoute: () => apphotelroomid,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/room/[id]/index").then((m) =>
    createLazyRoute("/app/hotel/room/$id")({ component: m.default }),
  ),
);
const apphotelnew = createRoute({
  getParentRoute: () => apphotel,
  path: "new",
});
const apphotelnewindex = createRoute({
  getParentRoute: () => apphotelnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/new/index").then((m) =>
    createLazyRoute("/app/hotel/new")({ component: m.default }),
  ),
);
const apphotelindex = createRoute({
  getParentRoute: () => apphotel,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/index").then((m) =>
    createLazyRoute("/app/hotel")({ component: m.default }),
  ),
);
const apphotelamenity = createRoute({
  getParentRoute: () => apphotel,
  path: "amenity",
});
const apphotelamenityindex = createRoute({
  getParentRoute: () => apphotelamenity,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/amenity/index").then((m) =>
    createLazyRoute("/app/hotel/amenity")({ component: m.default }),
  ),
);
const apphotelid = createRoute({ getParentRoute: () => apphotel, path: "$id" });
const apphotelidindex = createRoute({
  getParentRoute: () => apphotelid,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/[id]/index").then((m) =>
    createLazyRoute("/app/hotel/$id")({ component: m.default }),
  ),
);
const apphotelidedit = createRoute({
  getParentRoute: () => apphotelid,
  path: "edit",
});
const apphotelideditindex = createRoute({
  getParentRoute: () => apphotelidedit,
  path: "/",
}).lazy(() =>
  import("./pages/app/hotel/[id]/edit/index").then((m) =>
    createLazyRoute("/app/hotel/$id/edit")({ component: m.default }),
  ),
);
const appfood = createRoute({ getParentRoute: () => app, path: "food" });
const appfoodorders = createRoute({
  getParentRoute: () => appfood,
  path: "orders",
});
const appfoodordersindex = createRoute({
  getParentRoute: () => appfoodorders,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/orders/index").then((m) =>
    createLazyRoute("/app/food/orders")({ component: m.default }),
  ),
);
const appfoodnew = createRoute({ getParentRoute: () => appfood, path: "new" });
const appfoodnewindex = createRoute({
  getParentRoute: () => appfoodnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/new/index").then((m) =>
    createLazyRoute("/app/food/new")({ component: m.default }),
  ),
);
const appfoodindex = createRoute({
  getParentRoute: () => appfood,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/index").then((m) =>
    createLazyRoute("/app/food")({ component: m.default }),
  ),
);
const appfoodcategory = createRoute({
  getParentRoute: () => appfood,
  path: "category",
});
const appfoodcategorynew = createRoute({
  getParentRoute: () => appfoodcategory,
  path: "new",
});
const appfoodcategorynewindex = createRoute({
  getParentRoute: () => appfoodcategorynew,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/category/new/index").then((m) =>
    createLazyRoute("/app/food/category/new")({ component: m.default }),
  ),
);
const appfoodcategoryindex = createRoute({
  getParentRoute: () => appfoodcategory,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/category/index").then((m) =>
    createLazyRoute("/app/food/category")({ component: m.default }),
  ),
);
const appfoodcategoryid = createRoute({
  getParentRoute: () => appfoodcategory,
  path: "$id",
});
const appfoodcategoryidindex = createRoute({
  getParentRoute: () => appfoodcategoryid,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/category/[id]/index").then((m) =>
    createLazyRoute("/app/food/category/$id")({ component: m.default }),
  ),
);
const appfoodaddons = createRoute({
  getParentRoute: () => appfood,
  path: "addons",
});
const appfoodaddonsnew = createRoute({
  getParentRoute: () => appfoodaddons,
  path: "new",
});
const appfoodaddonsnewindex = createRoute({
  getParentRoute: () => appfoodaddonsnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/addons/new/index").then((m) =>
    createLazyRoute("/app/food/addons/new")({ component: m.default }),
  ),
);
const appfoodaddonsitem = createRoute({
  getParentRoute: () => appfoodaddons,
  path: "item",
});
const appfoodaddonsitemcategoryId = createRoute({
  getParentRoute: () => appfoodaddonsitem,
  path: "$categoryId",
});
const appfoodaddonsitemcategoryIdindex = createRoute({
  getParentRoute: () => appfoodaddonsitemcategoryId,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/addons/item/[categoryId]/index").then((m) =>
    createLazyRoute("/app/food/addons/item/$categoryId")({
      component: m.default,
    }),
  ),
);
const appfoodaddonsindex = createRoute({
  getParentRoute: () => appfoodaddons,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/addons/index").then((m) =>
    createLazyRoute("/app/food/addons")({ component: m.default }),
  ),
);
const appfoodid = createRoute({ getParentRoute: () => appfood, path: "$id" });
const appfoodidindex = createRoute({
  getParentRoute: () => appfoodid,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/[id]/index").then((m) =>
    createLazyRoute("/app/food/$id")({ component: m.default }),
  ),
);
const appfoodidedit = createRoute({
  getParentRoute: () => appfoodid,
  path: "edit",
});
const appfoodideditindex = createRoute({
  getParentRoute: () => appfoodidedit,
  path: "/",
}).lazy(() =>
  import("./pages/app/food/[id]/edit/index").then((m) =>
    createLazyRoute("/app/food/$id/edit")({ component: m.default }),
  ),
);
const appequipment = createRoute({
  getParentRoute: () => app,
  path: "equipment",
});
const appequipmentnew = createRoute({
  getParentRoute: () => appequipment,
  path: "new",
});
const appequipmentnewindex = createRoute({
  getParentRoute: () => appequipmentnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/equipment/new/index").then((m) =>
    createLazyRoute("/app/equipment/new")({ component: m.default }),
  ),
);
const appequipmentindex = createRoute({
  getParentRoute: () => appequipment,
  path: "/",
}).lazy(() =>
  import("./pages/app/equipment/index").then((m) =>
    createLazyRoute("/app/equipment")({ component: m.default }),
  ),
);
const appequipmentcategories = createRoute({
  getParentRoute: () => appequipment,
  path: "categories",
});
const appequipmentcategoriesindex = createRoute({
  getParentRoute: () => appequipmentcategories,
  path: "/",
}).lazy(() =>
  import("./pages/app/equipment/categories/index").then((m) =>
    createLazyRoute("/app/equipment/categories")({ component: m.default }),
  ),
);
const appequipmentid = createRoute({
  getParentRoute: () => appequipment,
  path: "$id",
});
const appequipmentidindex = createRoute({
  getParentRoute: () => appequipmentid,
  path: "/",
}).lazy(() =>
  import("./pages/app/equipment/[id]/index").then((m) =>
    createLazyRoute("/app/equipment/$id")({ component: m.default }),
  ),
);
const appequipmentidedit = createRoute({
  getParentRoute: () => appequipmentid,
  path: "edit",
});
const appequipmentideditindex = createRoute({
  getParentRoute: () => appequipmentidedit,
  path: "/",
}).lazy(() =>
  import("./pages/app/equipment/[id]/edit/index").then((m) =>
    createLazyRoute("/app/equipment/$id/edit")({ component: m.default }),
  ),
);
const appcinema = createRoute({ getParentRoute: () => app, path: "cinema" });
const appcinemanew = createRoute({
  getParentRoute: () => appcinema,
  path: "new",
});
const appcinemanewindex = createRoute({
  getParentRoute: () => appcinemanew,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/new/index").then((m) =>
    createLazyRoute("/app/cinema/new")({ component: m.default }),
  ),
);
const appcinemamovies = createRoute({
  getParentRoute: () => appcinema,
  path: "movies",
});
const appcinemamoviessnacks = createRoute({
  getParentRoute: () => appcinemamovies,
  path: "snacks",
});
const appcinemamoviessnacksindex = createRoute({
  getParentRoute: () => appcinemamoviessnacks,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/movies/snacks/index").then((m) =>
    createLazyRoute("/app/cinema/movies/snacks")({ component: m.default }),
  ),
);
const appcinemamoviesnew = createRoute({
  getParentRoute: () => appcinemamovies,
  path: "new",
});
const appcinemamoviesnewindex = createRoute({
  getParentRoute: () => appcinemamoviesnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/movies/new/index").then((m) =>
    createLazyRoute("/app/cinema/movies/new")({ component: m.default }),
  ),
);
const appcinemamoviesindex = createRoute({
  getParentRoute: () => appcinemamovies,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/movies/index").then((m) =>
    createLazyRoute("/app/cinema/movies")({ component: m.default }),
  ),
);
const appcinemamoviesid = createRoute({
  getParentRoute: () => appcinemamovies,
  path: "$id",
});
const appcinemamoviesidindex = createRoute({
  getParentRoute: () => appcinemamoviesid,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/movies/[id]/index").then((m) =>
    createLazyRoute("/app/cinema/movies/$id")({ component: m.default }),
  ),
);
const appcinemamoviesidedit = createRoute({
  getParentRoute: () => appcinemamoviesid,
  path: "edit",
});
const appcinemamoviesideditindex = createRoute({
  getParentRoute: () => appcinemamoviesidedit,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/movies/[id]/edit/index").then((m) =>
    createLazyRoute("/app/cinema/movies/$id/edit")({ component: m.default }),
  ),
);
const appcinemaindex = createRoute({
  getParentRoute: () => appcinema,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/index").then((m) =>
    createLazyRoute("/app/cinema")({ component: m.default }),
  ),
);
const appcinemahalls = createRoute({
  getParentRoute: () => appcinema,
  path: "halls",
});
const appcinemahallsindex = createRoute({
  getParentRoute: () => appcinemahalls,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/halls/index").then((m) =>
    createLazyRoute("/app/cinema/halls")({ component: m.default }),
  ),
);
const appcinemaid = createRoute({
  getParentRoute: () => appcinema,
  path: "$id",
});
const appcinemaidindex = createRoute({
  getParentRoute: () => appcinemaid,
  path: "/",
}).lazy(() =>
  import("./pages/app/cinema/[id]/index").then((m) =>
    createLazyRoute("/app/cinema/$id")({ component: m.default }),
  ),
);
const appbookings = createRoute({
  getParentRoute: () => app,
  path: "bookings",
});
const appbookingsvrgame = createRoute({
  getParentRoute: () => appbookings,
  path: "vr-game",
});
const appbookingsvrgameindex = createRoute({
  getParentRoute: () => appbookingsvrgame,
  path: "/",
}).lazy(() =>
  import("./pages/app/bookings/vr-game/index").then((m) =>
    createLazyRoute("/app/bookings/vr-game")({ component: m.default }),
  ),
);
const appbookingsstudio = createRoute({
  getParentRoute: () => appbookings,
  path: "studio",
});
const appbookingsstudioindex = createRoute({
  getParentRoute: () => appbookingsstudio,
  path: "/",
}).lazy(() =>
  import("./pages/app/bookings/studio/index").then((m) =>
    createLazyRoute("/app/bookings/studio")({ component: m.default }),
  ),
);
const appbookingsmovies = createRoute({
  getParentRoute: () => appbookings,
  path: "movies",
});
const appbookingsmoviesindex = createRoute({
  getParentRoute: () => appbookingsmovies,
  path: "/",
}).lazy(() =>
  import("./pages/app/bookings/movies/index").then((m) =>
    createLazyRoute("/app/bookings/movies")({ component: m.default }),
  ),
);
const appbookingshotel = createRoute({
  getParentRoute: () => appbookings,
  path: "hotel",
});
const appbookingshotelindex = createRoute({
  getParentRoute: () => appbookingshotel,
  path: "/",
}).lazy(() =>
  import("./pages/app/bookings/hotel/index").then((m) =>
    createLazyRoute("/app/bookings/hotel")({ component: m.default }),
  ),
);
const appbookingsequipment = createRoute({
  getParentRoute: () => appbookings,
  path: "equipment",
});
const appbookingsequipmentindex = createRoute({
  getParentRoute: () => appbookingsequipment,
  path: "/",
}).lazy(() =>
  import("./pages/app/bookings/equipment/index").then((m) =>
    createLazyRoute("/app/bookings/equipment")({ component: m.default }),
  ),
);
const appadvert = createRoute({ getParentRoute: () => app, path: "advert" });
const appadvertbanners = createRoute({
  getParentRoute: () => appadvert,
  path: "banners",
});
const appadvertbannersnew = createRoute({
  getParentRoute: () => appadvertbanners,
  path: "new",
});
const appadvertbannersnewindex = createRoute({
  getParentRoute: () => appadvertbannersnew,
  path: "/",
}).lazy(() =>
  import("./pages/app/advert/banners/new/index").then((m) =>
    createLazyRoute("/app/advert/banners/new")({ component: m.default }),
  ),
);
const appadvertbannersindex = createRoute({
  getParentRoute: () => appadvertbanners,
  path: "/",
}).lazy(() =>
  import("./pages/app/advert/banners/index").then((m) =>
    createLazyRoute("/app/advert/banners")({ component: m.default }),
  ),
);
const index = createRoute({
  getParentRoute: () => root,
  path: "/",
  // @ts-ignore
  loader: (...args) => import("./pages/index").then((m) => m.Loader(...args)),
}).lazy(() =>
  import("./pages/index").then((m) =>
    createLazyRoute("/")({ component: m.default }),
  ),
);

const config = root.addChildren([
  privacy.addChildren([privacyindex]),
  auth.addChildren([authlogin.addChildren([authloginindex])]),
  app.addChildren([
    appvr.addChildren([
      appvrpurchases.addChildren([appvrpurchasesindex]),
      appvrindex,
      appvrgames.addChildren([
        appvrgamesnew.addChildren([appvrgamesnewindex]),
        appvrgamesindex,
        appvrgamesgameId.addChildren([
          appvrgamesgameIdindex,
          appvrgamesgameIdedit.addChildren([appvrgamesgameIdeditindex]),
        ]),
      ]),
      appvrcategories.addChildren([appvrcategoriesindex]),
    ]),
    appusers.addChildren([
      appusersindex,
      appusersid.addChildren([appusersidindex]),
    ]),
    apptest.addChildren([apptestindex]),
    appstudio.addChildren([
      appstudioindex,
      appstudioall.addChildren([appstudioallindex]),
      appstudioid.addChildren([appstudioidindex]),
    ]),
    appsettings.addChildren([
      appsettingsprofile.addChildren([appsettingsprofileindex]),
      appsettingsindex,
      appsettingsdelivery.addChildren([
        appsettingsdeliverynew.addChildren([appsettingsdeliverynewindex]),
        appsettingsdeliveryindex,
      ]),
    ]),
    appnotifications.addChildren([appnotificationsindex]),
    appindex,
    apphotel.addChildren([
      apphotelroom.addChildren([
        apphotelroomid.addChildren([apphotelroomidindex]),
      ]),
      apphotelnew.addChildren([apphotelnewindex]),
      apphotelindex,
      apphotelamenity.addChildren([apphotelamenityindex]),
      apphotelid.addChildren([
        apphotelidindex,
        apphotelidedit.addChildren([apphotelideditindex]),
      ]),
    ]),
    appfood.addChildren([
      appfoodorders.addChildren([appfoodordersindex]),
      appfoodnew.addChildren([appfoodnewindex]),
      appfoodindex,
      appfoodcategory.addChildren([
        appfoodcategorynew.addChildren([appfoodcategorynewindex]),
        appfoodcategoryindex,
        appfoodcategoryid.addChildren([appfoodcategoryidindex]),
      ]),
      appfoodaddons.addChildren([
        appfoodaddonsnew.addChildren([appfoodaddonsnewindex]),
        appfoodaddonsitem.addChildren([
          appfoodaddonsitemcategoryId.addChildren([
            appfoodaddonsitemcategoryIdindex,
          ]),
        ]),
        appfoodaddonsindex,
      ]),
      appfoodid.addChildren([
        appfoodidindex,
        appfoodidedit.addChildren([appfoodideditindex]),
      ]),
    ]),
    appequipment.addChildren([
      appequipmentnew.addChildren([appequipmentnewindex]),
      appequipmentindex,
      appequipmentcategories.addChildren([appequipmentcategoriesindex]),
      appequipmentid.addChildren([
        appequipmentidindex,
        appequipmentidedit.addChildren([appequipmentideditindex]),
      ]),
    ]),
    appcinema.addChildren([
      appcinemanew.addChildren([appcinemanewindex]),
      appcinemamovies.addChildren([
        appcinemamoviessnacks.addChildren([appcinemamoviessnacksindex]),
        appcinemamoviesnew.addChildren([appcinemamoviesnewindex]),
        appcinemamoviesindex,
        appcinemamoviesid.addChildren([
          appcinemamoviesidindex,
          appcinemamoviesidedit.addChildren([appcinemamoviesideditindex]),
        ]),
      ]),
      appcinemaindex,
      appcinemahalls.addChildren([appcinemahallsindex]),
      appcinemaid.addChildren([appcinemaidindex]),
    ]),
    appbookings.addChildren([
      appbookingsvrgame.addChildren([appbookingsvrgameindex]),
      appbookingsstudio.addChildren([appbookingsstudioindex]),
      appbookingsmovies.addChildren([appbookingsmoviesindex]),
      appbookingshotel.addChildren([appbookingshotelindex]),
      appbookingsequipment.addChildren([appbookingsequipmentindex]),
    ]),
    appadvert.addChildren([
      appadvertbanners.addChildren([
        appadvertbannersnew.addChildren([appadvertbannersnewindex]),
        appadvertbannersindex,
      ]),
    ]),
  ]),
  index,
  _404,
]);

const router = createRouter({ routeTree: config });
export const routes = config;
export const Routes = () => <RouterProvider router={router} />;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
