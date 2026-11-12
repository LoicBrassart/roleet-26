import { Outlet } from "react-router";
import { Header } from "./Header";

export function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
