import { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    outline: boolean
}

function Button({ children, outline, ...otherProps }: ButtonProps) {
  return (
    <button className={`${classes.root} ${outline ? classes.outline : ''}`} {...otherProps}>
      {children}
    </button>
  );
}

export default Button;