import { createBrowserRouter, data, redirect } from "react-router";
import { articleListLoader, ArticleListPage } from "@/pages/article-list";
import { articleDetailLoader, ArticleDetailPage } from "@/pages/article-detail";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { App } from "./App";
import { scenarioListLoader, ScenarioListPage } from "@/pages/scenario-list";
import { scenarioDetailLoader } from "@/pages/scenario-detail";
import { ScenarioDetailPage } from "@/pages/scenario-detail";

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
            loader: () => redirect("/scenario"),
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
            path: "scenario",
            children: [
              {
                index: true,
                Component: ScenarioListPage,
                loader: scenarioListLoader,
              },
              {
                path: ":id",
                Component: ScenarioDetailPage,
                loader: scenarioDetailLoader,
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
