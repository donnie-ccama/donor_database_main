'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import LoginForm from './form'
import styles from './login.module.css'

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <Heart className={styles.logoIcon} />
                    <h1 className={styles.logoText}>DonorCRM</h1>
                </div>

                <p className={styles.subtitle}>Sign in to your account</p>

                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>

                <p className={styles.signup}>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className={styles.link}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}

