import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'outline' | 'ghost' | 'light' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm font-sans font-medium tracking-[0.08em] transition-all duration-300 ease-silk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary: 'bg-olive-deep text-warm hover:bg-forest',
  outline: 'border border-olive/40 bg-transparent text-forest hover:border-olive hover:bg-warm',
  ghost: 'text-olive hover:bg-olive/8',
  light: 'border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white/25',
  accent: 'bg-champagne text-forest hover:bg-warm',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.75rem]',
  md: 'h-11 px-6 text-[0.8rem]',
  lg: 'h-13 px-8 text-[0.85rem]',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', extra = ''): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

export function LinkButton({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: LinkButtonProps) {
  return (
    <a className={buttonClasses(variant, size, className)} {...rest}>
      {icon}
      {children}
    </a>
  );
}
