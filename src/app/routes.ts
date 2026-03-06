import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Jobs } from "./pages/Jobs";
import { JobDetail } from "./pages/JobDetail";
import { Admin } from "./pages/Admin";
import { Auth } from "./pages/Auth";
import { Apply } from "./pages/Apply";
import { Companies } from "./pages/Companies";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "jobs", Component: Jobs },
      { path: "jobs/:id", Component: JobDetail },
      { path: "jobs/:id/apply", Component: Apply },
      { path: "companies", Component: Companies },
      { path: "profile", Component: Profile },
      { path: "admin", Component: Admin },
      { path: "login", Component: Auth },
      { path: "signup", Component: Auth },
    ],
  },
]);
