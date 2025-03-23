
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-mono ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-cyan focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-terminal-darkGray border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/20",
        destructive:
          "bg-terminal-darkGray border border-destructive text-destructive hover:bg-destructive/20",
        outline:
          "border border-terminal-cyan/50 bg-transparent text-terminal-cyan hover:bg-terminal-cyan/10",
        secondary:
          "bg-terminal-gray text-terminal-foreground hover:bg-terminal-gray/80 border border-terminal-cyan/30",
        ghost: "hover:bg-terminal-darkGray hover:text-terminal-cyan",
        link: "text-terminal-cyan underline-offset-4 hover:underline",
        terminal: "bg-terminal-darkGray border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/20 focus:ring-1 focus:ring-terminal-cyan",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
