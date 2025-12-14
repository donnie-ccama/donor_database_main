import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
    children: ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
}

interface CardHeaderProps {
    title: string
    action?: ReactNode
    subtitle?: string
}

export function Card({ children, className = '', padding = 'lg' }: CardProps) {
    return (
        <div className={`${styles.card} ${styles[`padding-${padding}`]} ${className}`}>
            {children}
        </div>
    )
}

export function CardHeader({ title, action, subtitle }: CardHeaderProps) {
    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {action && <div className={styles.action}>{action}</div>}
        </div>
    )
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`${styles.content} ${className}`}>{children}</div>
}
