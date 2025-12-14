import Link from 'next/link'
import { Button } from '@/components/ui'

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            gap: '1.5rem',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '1rem'
        }}>
            <h1 style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: 'var(--accent-primary)',
                lineHeight: 1
            }}>404</h1>

            <div style={{ maxWidth: '400px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Page Not Found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <Link href="/">
                    <Button variant="primary">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
