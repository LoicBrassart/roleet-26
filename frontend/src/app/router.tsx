import { createBrowserRouter, redirect } from "react-router";
import { articleListLoader, ArticleListPage } from "../pages/article-list";
import {
  articleDetailLoader,
  ArticleDetailPage,
} from "../pages/article-detail";
import { RootErrorBoundary } from "./RootErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        index: true,
        loader: () => redirect("/blog"),
      },
      {
        path: "blog",
        children: [
          {
            index: true,
            Component: ArticleListPage,
            loader: articleListLoader,
          },
          {
            path: ":id",
            Component: ArticleDetailPage,
            loader: articleDetailLoader,
          },
        ],
      },
    ],
  },
]);
