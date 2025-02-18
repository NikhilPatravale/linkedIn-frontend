import { InputHTMLAttributes } from "react";
import classes from "./Input.module.scss";

type InputProps = {
    label?: string,
    inputSize?: "sm" | "md" | "lg",
    width?: string,
    floatingInput?: boolean
  } & InputHTMLAttributes<HTMLInputElement>

function Input({ label, inputSize, floatingInput, width, ...otherProps } : InputProps) {
  return (
    <div className={`${classes.root} ${classes[inputSize || 'lg']}`}>
      <input
        required
        className={`${floatingInput ? classes.floatingInput : ''}`}
        {...otherProps}
        style={{
          width: width ? `${width}px` : '100%',
        }}
      />
      <label htmlFor={otherProps.id} className={classes.floatingLabel}>{label}</label>
    </div>
  );
}

export default Input;