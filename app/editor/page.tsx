import Editor from '@/components/Editor'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

interface EditorPageProps {
    searchParams: Promise<{ id?: string }> | { id?: string }
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
    const resolvedParams = await searchParams
    const id = resolvedParams?.id
    const supabase = await createClient()

    // 1. Check user on server
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    let script = null

    // 2. Fetch script if ID is provided
    if (id) {
        const { data } = await supabase
            .from('scripts')
            .select('*')
            .eq('id', id)
            .single()

        script = data
    }

    // initialData={script} -> if script is null, Editor treats as new.
    // scriptId={script?.id}
    return <Editor initialData={script || undefined} scriptId={script?.id} />
}
