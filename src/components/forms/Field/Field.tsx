import type { ReactNode } from 'react'

function Field({
  label,
  htmlFor,
  children,
}: {
  label?: ReactNode
  htmlFor: string
  children: ReactNode
}) {
  if (!label) {
    return <>{children}</>
  }

  return (
    <div className="field-group">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default Field
