import { ReactElement } from "react";
import classes from "./Layout.module.scss";

function Layout({ children, className }: { children: ReactElement, className: string}) {
  return (
    <div className={`${classes.root} ${className}`}>
      <header className={classes.container}>
        <a href="/">
          <img src="/logo.svg" alt="linkedIn-main" className={classes.logo} />
        </a>
      </header>
      <main className={classes.container}>
        {children}
      </main>
      <footer className={classes.footer}>
        <ul className={classes.container}>
          <li>
            <img src="/logo-dark.svg" alt="linkedIn-dark" />
            <span>© 2025</span>
          </li>
          <li><a href="">Accessibility</a></li>
          <li><a href="">User Agreement</a></li>
          <li><a href="">Privacy Policy</a></li>
          <li><a href="">Cookie Policy</a></li>
          <li><a href="">Copywright Policy</a></li>
          <li><a href="">Brand Policy</a></li>
          <li><a href="">Guest Controls</a></li>
          <li><a href="">Community Guidelines</a></li>
          <li><a href="">Language</a></li>
        </ul>
      </footer>
    </div>
  );
}

export default Layout;