'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'
import styles from './signup.module.css'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            setLoading(false)
            return
        }

        try {
            const supabase = createClient()
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                },
            })

            if (error) {
                setError(error.message)
                return
            }

            if (data.user) {
                // Create user record in our users table
                await supabase.from('users').insert({
                    auth_user_id: data.user.id,
                    email: data.user.email,
                    name,
                    role: 'staff',
                })
            }

            setSuccess(true)
        } catch {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.logo}>
                        <Heart className={styles.logoIcon} />
                        <h1 className={styles.logoText}>Citykid Donor CRM</h1>
                    </div>

                    <div className={styles.success}>
                        <h2>Check your email</h2>
                        <p>
                            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                            Please click the link to verify your account.
                        </p>
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/login')}
                            className={styles.submitButton}
                        >
                            Back to Login
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <Heart className={styles.logoIcon} />
                    <h1 className={styles.logoText}>Citykid Donor CRM</h1>
                </div>

                <p className={styles.subtitle}>Create your account</p>

                <form onSubmit={handleSignup} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.field}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.inputIcon} />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Smith"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={styles.input}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeButton}
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} />
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={loading}
                        className={styles.submitButton}
                    >
                        Create Account
                    </Button>
                </form>

                <p className={styles.login}>
                    Already have an account?{' '}
                    <Link href="/login" className={styles.link}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
