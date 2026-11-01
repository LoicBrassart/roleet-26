import { createBrowserRouter, data, redirect } from "react-router";
import { articleListLoader, ArticleListPage } from "@/pages/article-list";
import { articleDetailLoader, ArticleDetailPage } from "@/pages/article-detail";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
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
          {
            path: "*",
            loader: () => {
              throw data("Page introuvable", { status: 404 });
            },
          },
        ],
      },
    ],
  },
]);
