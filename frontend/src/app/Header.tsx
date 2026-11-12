import { NavLink } from "react-router";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.Header}>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : styles.default
              }
            >
              Roleet 26 !
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/scenario"
              className={({ isActive }) =>
                isActive ? styles.active : styles.default
              }
            >
              Scenarios
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                isActive ? styles.active : styles.default
              }
            >
              Blog
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
