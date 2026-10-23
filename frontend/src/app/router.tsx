import App from "./App.tsx";
import { createBrowserRouter } from "react-router";
import { getAll } from "../entities/article/index.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: getAll,
  },
]);
