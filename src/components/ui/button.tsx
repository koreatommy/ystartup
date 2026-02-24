import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/40 shadow-lg",
        outline:
          "border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md text-[var(--color-text)] hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-[var(--glass-bg-hover)] hover:text-[var(--color-text)]",
        link: "text-primary underline-offset-4 hover:underline",
        // 새로운 글래스모피즘 variants
        glass:
          "glass text-[var(--color-text)] hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)] backdrop-blur-md",
        "glass-primary":
          "glass border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/50",
        gradient:
          "gradient-primary text-white border-0 shadow-lg hover:shadow-xl hover:brightness-110",
        "gradient-secondary":
          "gradient-secondary text-white border-0 shadow-lg hover:shadow-xl hover:brightness-110",
        "gradient-success":
          "gradient-success text-white border-0 shadow-lg hover:shadow-xl hover:brightness-110",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-2xl px-10 has-[>svg]:px-8 text-lg",
        icon: "size-10 rounded-xl",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
