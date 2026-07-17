import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'className'> {
  variant?: ButtonVariant
}

function Button({ variant = ButtonVariant.Primary, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      className={`button button--${variant}`}
    />
  )
}

export default Button
