import { createBrowserRouter } from "react-router";
import {
  AgencyPage,
  ContactPage,
  HomePage,
  MediaDetailPage,
  MediaPage,
  NotFoundPage,
  PartnersPage,
  Root,
  ServiceDetailPage,
  ServicesPage,
} from "./site";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "agence", Component: AgencyPage },
      { path: "expertises", Component: ServicesPage },
      { path: "expertises/:slug", Component: ServiceDetailPage },
      { path: "partenaires", Component: PartnersPage },
      { path: "mediatheque", Component: MediaPage },
      { path: "mediatheque/:slug", Component: MediaDetailPage },
      { path: "contact", Component: ContactPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
