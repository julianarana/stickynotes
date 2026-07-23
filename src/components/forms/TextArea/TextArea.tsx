import { useId } from "react";
import type { TextareaHTMLAttributes, ReactNode } from "react";
import Field from "../Field";
import "../field.css";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

function TextArea({ label, className, id, ...props }: TextAreaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <Field label={label} htmlFor={textareaId}>
      <textarea
        id={textareaId}
        className={className ? `field ${className}` : "field"}
        {...props}
      />
    </Field>
  );
}

export default TextArea;
