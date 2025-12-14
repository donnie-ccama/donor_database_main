'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

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
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--error)',
            }}>Something went wrong!</h1>

            <div style={{ maxWidth: '600px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>

                {/* Debug Info - Remove in production if sensitive */}
                <div style={{
                    backgroundColor: 'rgba(255,0,0,0.1)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    textAlign: 'left',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: 'var(--error)'
                }}>
                    <p><strong>Error:</strong> {error.message}</p>
                    {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Button variant="primary" onClick={() => reset()}>
                        Try again
                    </Button>
                    <Button variant="secondary" onClick={() => window.location.href = '/'}>
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
