'use client'

import { Search, Bell, User, LogOut } from 'lucide-react'
import styles from './Header.module.css'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    title: string
    subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
    const [showDropdown, setShowDropdown] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/donors?search=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.titleSection}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>

            <div className={styles.actions}>
                <form onSubmit={handleSearch} className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search donors..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <button className={styles.iconButton} title="Notifications">
                    <Bell />
                </button>

                <div className={styles.userMenu} ref={dropdownRef}>
                    <button
                        className={styles.userButton}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <User />
                    </button>

                    {showDropdown && (
                        <div className={styles.dropdown}>
                            <button onClick={handleLogout} className={styles.dropdownItem}>
                                <LogOut className={styles.dropdownIcon} />
                                <span>Sign out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
