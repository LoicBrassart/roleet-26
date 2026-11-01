import { Link, Outlet } from "react-router";

export function App() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Roleet 26 !</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/scenario">Scenarios</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
