import { createBrowserRouter, redirect } from "react-router";
import { articleListLoader, ArticleListPage } from "../pages/article-list";
import {
  articleDetailLoader,
  ArticleDetailPage,
} from "../pages/article-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/blog"),
  },
  {
    path: "/blog",
    Component: ArticleListPage,
    loader: articleListLoader,
  },
  {
    path: "/blog/:id",
    Component: ArticleDetailPage,
    loader: articleDetailLoader,
  },
]);
