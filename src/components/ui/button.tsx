import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-[var(--blue-9)] text-white hover:bg-[var(--blue-10)] shadow-sm',
        destructive:
          'bg-[var(--error)] text-white hover:bg-[var(--border-error)] focus-visible:ring-[var(--error)]/20 dark:focus-visible:ring-[var(--error)]/40',
        outline:
          'border border-[var(--slate-7)] bg-background shadow-xs hover:bg-[var(--slate-3)] hover:text-[var(--slate-12)] dark:bg-[var(--slate-2)] dark:border-[var(--slate-6)] dark:hover:bg-[var(--slate-4)]',
        secondary:
          'bg-[var(--slate-4)] text-[var(--slate-12)] hover:bg-[var(--slate-5)]',
        ghost:
          'hover:bg-[var(--slate-4)] hover:text-[var(--slate-12)] dark:hover:bg-[var(--slate-5)]',
        link: 'text-[var(--blue-9)] underline-offset-4 hover:underline hover:text-[var(--blue-10)]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
