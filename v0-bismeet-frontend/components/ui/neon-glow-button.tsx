'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface NeonGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  glowColor?: 'lime' | 'orange' | 'default'
  asChild?: boolean
}

const NeonGlowButton = React.forwardRef<HTMLButtonElement, NeonGlowButtonProps>(
  ({ className, active = false, glowColor = 'default', children, ...props }, ref) => {
    const glowStyles = {
      lime: {
        glow: 'hover:shadow-[0_0_20px_rgba(163,230,53,0.4),0_0_40px_rgba(163,230,53,0.2)]',
        activeGlow: 'shadow-[0_0_20px_rgba(163,230,53,0.5),0_0_40px_rgba(163,230,53,0.25)]',
        activeBg: 'bg-lime/15',
        activeText: 'text-lime',
      },
      orange: {
        glow: 'hover:shadow-[0_0_20px_rgba(251,146,60,0.4),0_0_40px_rgba(251,146,60,0.2)]',
        activeGlow: 'shadow-[0_0_20px_rgba(251,146,60,0.5),0_0_40px_rgba(251,146,60,0.25)]',
        activeBg: 'bg-orange/15',
        activeText: 'text-orange',
      },
      default: {
        glow: 'hover:shadow-[0_0_20px_rgba(163,230,53,0.4),0_0_40px_rgba(163,230,53,0.2)]',
        activeGlow: 'shadow-[0_0_20px_rgba(163,230,53,0.5),0_0_40px_rgba(163,230,53,0.25)]',
        activeBg: 'bg-primary/15',
        activeText: 'text-primary',
      },
    }

    const styles = glowStyles[glowColor]

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-xl',
          'transition-all duration-300 ease-out',
          'text-muted-foreground',
          'hover:text-foreground hover:bg-card/80',
          styles.glow,
          active && [
            styles.activeBg,
            styles.activeText,
            styles.activeGlow,
            'border border-primary/20',
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

NeonGlowButton.displayName = 'NeonGlowButton'

export { NeonGlowButton }
