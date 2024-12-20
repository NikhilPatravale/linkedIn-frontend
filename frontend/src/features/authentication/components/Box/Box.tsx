import { ReactElement } from "react";
import classes from "./Box.module.scss";

function Box({ children }: { children: ReactElement }) {
    return (
        <div className={classes.root}>
            {children}
        </div>
    );
}

export default Box;