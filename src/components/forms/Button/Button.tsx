import type { ButtonHTMLAttributes } from "react";
import { ButtonVariant } from "./ButtonVariant";
import "./Button.css";

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "className"
> {
  variant?: ButtonVariant;
}

function Button({ variant = ButtonVariant.Primary, ...props }: ButtonProps) {
  return (
    <button {...props} type="button" className={`button button--${variant}`} />
  );
}

export default Button;
