import { createClient } from '@/utils/supabase/server'
import { CheckCircle, XCircle } from '@phosphor-icons/react/dist/ssr'
import { DeleteUserButton } from './components/delete-user-button'
import { ImpersonateButton } from './components/impersonate-button'

export default async function AdminPage() {
    const supabase = await createClient()

    // Fetch all profiles
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch stats
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: totalArtworks } = await supabase.from('artworks').select('*', { count: 'exact', head: true })
    const { count: totalViews } = await supabase.from('profile_views').select('*', { count: 'exact', head: true })

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-500">Overview of all registered accounts.</p>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Users</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Artworks</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{totalArtworks}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Views</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{totalViews}</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Subscription</th>
                            <th className="p-4">Admin?</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {profiles?.map((profile) => (
                            <tr key={profile.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="font-medium text-gray-900">{profile.full_name || 'No Name'}</div>
                                    <div className="text-sm text-gray-500">{profile.email}</div>
                                    <div className="text-xs text-gray-400 font-mono mt-0.5">@{profile.username || 'no-username'}</div>
                                </td>
                                <td className="p-4 text-sm text-gray-700 capitalize">{profile.account_type}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile.subscription_status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {profile.subscription_status || 'free'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {profile.is_admin ? (
                                        <CheckCircle size={20} className="text-green-600" weight="fill" />
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(profile.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 flex items-center">
                                    <a
                                        href={`/${profile.username}`}
                                        target="_blank"
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mr-3"
                                    >
                                        View Site
                                    </a>
                                    {!profile.is_admin && (
                                        <div className="flex items-center gap-2">
                                            <ImpersonateButton id={profile.id} />
                                            <DeleteUserButton id={profile.id} />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
