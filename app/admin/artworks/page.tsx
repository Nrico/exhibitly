import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { DeleteArtworkButton } from '../components/delete-artwork-button'

export default async function AdminArtworksPage() {
    const supabase = await createClient()

    // Fetch all artworks with user details
    const { data: artworks } = await supabase
        .from('artworks')
        .select('*, profiles(username, email)')
        .order('created_at', { ascending: false })

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Global Inventory</h1>
                <p className="text-gray-500">Manage all uploads from all users.</p>
            </header>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <th className="p-4">Artwork</th>
                            <th className="p-4">Artist</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Uploaded</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {artworks?.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                                            {item.image_url ? (
                                                <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{item.title}</div>
                                            <div className="text-xs text-gray-500">{item.medium}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm">
                                    <div className="text-gray-900">@{item.profiles?.username}</div>
                                    <div className="text-xs text-gray-500">{item.profiles?.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                                        item.status === 'sold' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm font-mono text-gray-700">
                                    ${item.price}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <DeleteArtworkButton id={item.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
