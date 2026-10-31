import { Link, Outlet } from "react-router";

export function App() {
  return (
    <>
      <header>
        <p>
          <Link to="/">Roleet 26 !</Link>
        </p>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
