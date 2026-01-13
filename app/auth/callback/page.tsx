'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get('code')
            const next = searchParams.get('next') ?? '/dashboard'

            if (code) {
                const supabase = createClient()
                const { error } = await supabase.auth.exchangeCodeForSession(code)
                if (!error) {
                    router.push(next)
                    return
                }
            }

            // Error or no code
            router.push('/auth/auth-code-error')
        }

        handleCallback()
    }, [router, searchParams])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <AuthCallbackContent />
        </Suspense>
    )
}
