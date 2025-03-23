
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-terminal-cyan bg-terminal-darkGray text-terminal-cyan shadow",
        secondary:
          "border-terminal-gray bg-terminal-gray text-terminal-foreground",
        destructive:
          "border-destructive bg-terminal-darkGray text-destructive shadow",
        outline: "text-terminal-foreground border-terminal-cyan/30",
        success: 
          "border-success bg-terminal-darkGray text-success shadow",
        warning: 
          "border-warning bg-terminal-darkGray text-warning shadow",
        terminal:
          "border-terminal-cyan/50 bg-terminal-darkGray text-terminal-cyan shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
