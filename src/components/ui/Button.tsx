'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        children,
        variant = 'primary',
        size = 'md',
        isLoading = false,
        icon,
        className = '',
        disabled,
        ...props
    }, ref) => {
        return (
            <button
                ref={ref}
                className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className={styles.spinner} />
                ) : icon ? (
                    <span className={styles.icon}>{icon}</span>
                ) : null}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
