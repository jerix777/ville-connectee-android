
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-modern",
  {
    variants: {
      variant: {
        default: "bg-expo-accent text-white hover:bg-expo-accent/90 shadow-soft hover:shadow-medium",
        destructive: "bg-expo-error text-white hover:bg-expo-error/90 shadow-soft hover:shadow-medium",
        outline: "border-2 border-expo-gray-200 bg-white hover:bg-expo-gray-50 text-expo-DEFAULT hover:border-expo-accent",
        secondary: "bg-expo-gray-100 text-expo-gray-700 hover:bg-expo-gray-200",
        ghost: "hover:bg-expo-gray-100 hover:text-expo-DEFAULT",
        link: "text-expo-accent underline-offset-4 hover:underline",
        ville: "bg-gradient-to-r from-expo-accent to-expo-success text-white hover:from-expo-accent/90 hover:to-expo-success/90 shadow-medium hover:shadow-strong",
        success: "bg-expo-success text-white hover:bg-expo-success/90 shadow-soft hover:shadow-medium",
        warning: "bg-expo-warning text-white hover:bg-expo-warning/90 shadow-soft hover:shadow-medium",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
        xs: "h-8 rounded-lg px-3 text-xs",
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
