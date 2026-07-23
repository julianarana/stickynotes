import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import Field from "../Field";
import "../field.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

function TextField({ label, className, id, ...props }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <Field label={label} htmlFor={inputId}>
      <input
        id={inputId}
        className={className ? `field ${className}` : "field"}
        {...props}
      />
    </Field>
  );
}

export default TextField;
