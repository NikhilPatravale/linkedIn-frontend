import { ReactNode } from "react";
import classes from "./Seperator.module.scss";

function Seperator({ children }: { children: ReactNode }) {
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
}

export default Seperator;