import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const sizeCls: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
}

const styles: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white shadow-sm shadow-brand-500/30 hover:bg-brand-600 disabled:bg-ink-300 disabled:shadow-none',
  secondary:
    'bg-white text-ink-900 ring-1 ring-ink-200 hover:bg-ink-50 hover:ring-ink-300 disabled:opacity-60',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-60',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  ...rest
}: Props) {
  const cls = [
    'inline-flex items-center justify-center rounded-xl font-semibold transition',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    fullWidth ? 'w-full' : '',
    sizeCls[size],
    styles[variant],
    className,
  ].join(' ')
  return <button className={cls} {...rest} />
}

export default Button
