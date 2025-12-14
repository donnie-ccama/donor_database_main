'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Gift,
    FolderOpen,
    Upload,
    RefreshCw,
    Settings,
    ChevronLeft,
    Heart
} from 'lucide-react'
import styles from './Sidebar.module.css'
import { useState } from 'react'

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/donors', label: 'Donors', icon: Users },
    { href: '/gifts', label: 'Gifts', icon: Gift },
    { href: '/segments', label: 'Segments', icon: FolderOpen },
    { href: '/import', label: 'Import', icon: Upload },
    { href: '/sync', label: 'Sync', icon: RefreshCw },
]

const bottomItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.logo}>
                <Heart className={styles.logoIcon} />
                {!collapsed && <span className={styles.logoText}>DonorCRM</span>}
            </div>

            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href))
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon className={styles.navIcon} />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                <ul className={styles.navList}>
                    {bottomItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href)
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <item.icon className={styles.navIcon} />
                                    {!collapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <button
                className={styles.collapseBtn}
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                <ChevronLeft className={`${styles.collapseIcon} ${collapsed ? styles.rotated : ''}`} />
            </button>
        </aside>
    )
}
