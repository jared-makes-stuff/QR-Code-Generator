import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
        default: "bg-[#B0E4CC] text-[#091413] hover:bg-[#9FD8BF]",
        secondary: "border border-[#408A71]/45 bg-[#408A71]/18 text-[#B0E4CC] hover:border-[#B0E4CC]/55 hover:bg-[#408A71]/26",
        ghost: "text-[#B0E4CC] hover:bg-[#408A71]/18",
        outline: "border border-[#408A71]/50 bg-transparent text-[#B0E4CC] hover:bg-[#408A71]/18",
    }

    const sizes = {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10 rounded-lg",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 ease-out active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0E4CC] disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
