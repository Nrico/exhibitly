import { createClient } from '@/utils/supabase/server'
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr'
import { ExportButton } from './export-button'

export default async function ExportPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div>Unauthorized</div>
    }

    const { data: artworks } = await supabase
        .from('artworks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Simple CSV Generation Logic (Client-side for MVP via data URI)
    // In a real app, we might generate this on the server.
    // For now, we'll embed the data in a client component or just use a simple script.
    // Actually, let's make this a client component for the download interaction.

    return (
        <div className="max-w-[800px] mx-auto">
            <header className="mb-10">
                <h1 className="font-serif text-4xl text-[#111111] mb-2">Export Data</h1>
                <p className="text-[#666666] text-sm">Download your inventory for backup or external use.</p>
            </header>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gray-100 p-4 rounded-full">
                        <DownloadSimple size={32} className="text-[#111111]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-[#111111]">CSV Export</h3>
                        <p className="text-sm text-[#666666]">Includes all artwork details (Title, Price, Status, etc.)</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6 font-mono text-xs text-[#666666]">
                    {artworks?.length || 0} records found.
                </div>

                <ExportButton artworks={artworks || []} />
            </div>
        </div>
    )
}


