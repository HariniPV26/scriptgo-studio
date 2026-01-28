import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import CalendarContent from '@/components/CalendarContent'
import { redirect } from 'next/navigation'

export default async function ContentCalendarPage() {
    const supabase = await createClient()

    // 1. Check user on the server
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/30">
            <Header />
            <CalendarContent user={user} />
        </div>
    )
}
