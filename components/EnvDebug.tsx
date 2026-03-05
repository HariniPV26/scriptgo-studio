'use client'

// Debug component to check if environment variables are loaded
export default function EnvDebug() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'black',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 9999,
            border: '1px solid #10b981'
        }}>
            <div><strong>ENV Debug:</strong></div>
            <div>Supabase URL: {supabaseUrl || '❌ NOT SET'}</div>
            <div>Anon Key: {hasAnonKey ? '✅ SET' : '❌ NOT SET'}</div>
        </div>
    )
}
