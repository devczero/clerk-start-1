"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type RadioGroupContextValue = {
  value: string
  onChange: (value: string) => void
  name: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name = "radio-group", children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onChange: onValueChange, name }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)

    if (!context) {
      throw new Error("RadioGroupItem must be used within RadioGroup")
    }

    const { value, onChange, name } = context
    const isChecked = value === itemValue

    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          ref={ref}
          name={name}
          value={itemValue}
          checked={isChecked}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-5 w-5 rounded-full border-2 border-white/30 text-white focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none checked:bg-white checked:border-white relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-black checked:before:block before:hidden",
            className
          )}
          {...props}
        />
        {children}
      </div>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
