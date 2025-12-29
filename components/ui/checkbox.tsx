"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          className={cn(
            "peer h-5 w-5 shrink-0 rounded border-2 border-white/30 shadow focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-white checked:border-white cursor-pointer",
            className
          )}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked)
            props.onChange?.(e)
          }}
          {...props}
        />
        <Check className="absolute left-0.5 top-0.5 h-4 w-4 text-black pointer-events-none opacity-0 peer-checked:opacity-100" />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
