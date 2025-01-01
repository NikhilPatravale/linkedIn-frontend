import { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    outline: boolean,
    size?: "sm" | "md" | "lg"
    className?: string
}

function Button({ children, size, outline, className, ...otherProps }: ButtonProps) {
  return (
    <button className={`${classes.root} ${outline ? classes.outline : ''} ${className} ${classes[size || "lg"]}`} {...otherProps}>
      {children}
    </button>
  );
}

export default Button;