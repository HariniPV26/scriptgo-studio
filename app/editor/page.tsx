'use client'

import Editor from '@/components/Editor'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

function EditorContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [script, setScript] = useState<any>(undefined) // undefined means loading/checking, null means new
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            if (id) {
                const { data, error } = await supabase
                    .from('scripts')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (data) {
                    setScript(data)
                }
            } else {
                setScript(null) // New script
            }
            setLoading(false)
        }
        checkAuthAndFetch()
    }, [id, router])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // initialData={script} -> if script is null, Editor treats as new.
    // scriptId={script?.id}
    return <Editor initialData={script || undefined} scriptId={script?.id} />
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <EditorContent />
        </Suspense>
    )
}
