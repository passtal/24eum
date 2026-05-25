import { InputHTMLAttributes, forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className = '', ...rest }, ref
) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label && <span className="font-medium text-slate-700">{label}</span>}
      <input
        ref={ref}
        className={[
          'rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none',
          'focus:border-slate-700 focus:ring-1 focus:ring-slate-400',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : '',
          className,
        ].join(' ')}
        {...rest}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
})

export default Input
