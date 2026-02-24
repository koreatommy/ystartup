import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-[var(--glass-bg)] text-[var(--color-text-secondary)] border-[var(--glass-border)] [a&]:hover:bg-[var(--glass-bg-hover)]",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "border-[var(--glass-border)] text-[var(--color-text)] bg-transparent [a&]:hover:bg-[var(--glass-bg)]",
        ghost: "text-[var(--color-text-muted)] [a&]:hover:bg-[var(--glass-bg)] [a&]:hover:text-[var(--color-text)]",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
        // 새로운 글래스모피즘 variants
        glass: "glass text-[var(--color-text)] backdrop-blur-sm",
        "glass-primary": "glass border-[var(--color-primary)]/30 text-[var(--color-primary)] bg-[var(--color-primary)]/10",
        "glass-success": "glass border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
        "glass-warning": "glass border-amber-500/30 text-amber-400 bg-amber-500/10",
        "glass-danger": "glass border-red-500/30 text-red-400 bg-red-500/10",
        gradient: "gradient-primary text-white border-0 shadow-sm",
        "gradient-secondary": "gradient-secondary text-white border-0 shadow-sm",
        "gradient-success": "gradient-success text-white border-0 shadow-sm",
        "gradient-warning": "gradient-warning text-white border-0 shadow-sm",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
