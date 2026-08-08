import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {}

interface LinkButtonProps
  extends BaseProps {
  href?: string;
  to?: string;
  external?: boolean;
  children: React.ReactNode;
}

const baseStyles =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-all duration-300 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none';

const sizeMap: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-base',
};

const variantMap: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-fg shadow-soft ' +
    'hover:bg-primary-accent hover:shadow-glow active:scale-[0.98]',
  secondary:
    'glass text-text hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]',
  ghost:
    'text-text/90 hover:text-text hover:bg-primary/5 active:scale-[0.98]',
  outline:
    'border border-[var(--color-border)] bg-transparent text-text ' +
    'hover:border-primary/50 hover:bg-primary/[0.06] active:scale-[0.98]',
};

const Spinner = () => (
  <span
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    aria-hidden
  />
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    icon,
    iconRight,
    fullWidth,
    loading,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        sizeMap[size],
        variantMap[variant],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Spinner />
      ) : icon ? (
        <span className="inline-flex">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && <span className="inline-flex transition-transform duration-300 group-hover:translate-x-0.5">{iconRight}</span>}

      {/* Subtle ripple/glow for primary */}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
        />
      )}
    </button>
  );
});

/**
 * A Link-styled button. Renders as <a> for external links,
 * <Link> for internal, and <button> otherwise.
 */
export function LinkButton({
  children,
  href,
  to,
  external,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  className,
}: LinkButtonProps & { className?: string }) {
  const classes = cn(
    baseStyles,
    sizeMap[size],
    variantMap[variant],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {iconRight && (
        <span className="inline-flex transition-transform duration-300 group-hover:translate-x-0.5">
          {iconRight}
        </span>
      )}
      {variant === 'primary' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40"
        />
      )}
    </>
  );

  if (external || href) {
    return (
      <a
        href={href ?? to}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} type="button">
      {content}
    </button>
  );
}