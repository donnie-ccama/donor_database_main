export default function Loading() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
        }}>
            <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
            <p style={{
                marginTop: '1rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>Loading...</p>
        </div>
    )
}
