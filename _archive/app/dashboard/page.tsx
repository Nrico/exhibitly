import FileUpload from '@/components/file-upload'
import DashboardHeader from '@/components/dashboard-header'; // Import DashboardHeader
import StatCard from '@/components/stat-card'; // Import StatCard
import { ArchiveBox, TrendUp, Globe, MagicWand } from '@phosphor-icons/react'; // Import icons

// Mock data for the recent uploads table
const recentUploads = [
  {
    image: "https://images.unsplash.com/photo-1579783902614-a3fb39279cdb?q=80&w=100",
    title: "Untitled Abstract #9",
    medium: "Oil on Canvas",
    uploaded: "2 hours ago",
    price: "--",
    status: "Needs Review",
  },
  {
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=100",
    title: "Study in Blue",
    medium: "Acrylic on Panel",
    uploaded: "Yesterday",
    price: "$850",
    status: "Live",
  },
  {
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=100",
    title: "High Desert Bloom",
    medium: "Oil on Canvas",
    uploaded: "Nov 14, 2025",
    price: "$1,200",
    status: "Sold",
  },
];

const getStatusPill = (status: string) => {
  switch (status) {
    case "Needs Review":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent-yellow-dashboard/[0.1] text-accent-yellow-dashboard">
          <MagicWand size={14} /> {status}
        </span>
      );
    case "Live":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent-green-dashboard/[0.1] text-accent-green-dashboard">
          {status}
        </span>
      );
    case "Sold":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-accent-red-dashboard/[0.1] text-accent-red-dashboard">
          {status}
        </span>
      );
    default:
      return null;
  }
};

export default function DashboardPage() {

  return (
    <>
      <DashboardHeader /> {/* Use the DashboardHeader */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"> {/* Stats Grid */}
        <StatCard title="Inventory Health" value="42 Items" icon={<ArchiveBox size={24} />}>
            <div className="flex gap-4 mt-4 pt-4 border-t border-border-dashboard text-sm">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent-green-dashboard"></span> 12 Available</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent-red-dashboard"></span> 30 Sold</div>
            </div>
        </StatCard>
        <StatCard title="Visitor Interest (30d)" value="1,240 Views" icon={<TrendUp size={24} />}>
            <div className="text-sm text-accent-green-dashboard mt-4 pt-4 border-t border-border-dashboard">
                +12% from last month
            </div>
        </StatCard>
        <StatCard title="Site Status" value="Online" icon={<Globe size={24} />}>
            <div className="text-sm text-text-muted-dashboard mt-4 pt-4 border-t border-border-dashboard">
                <a href="#" className="text-text-main-dashboard hover:underline">enricotrujillo.com</a>
            </div>
        </StatCard>
      </div>

      <h2 className="text-lg font-semibold text-text-main-dashboard mb-5">Recent Uploads</h2>
      <div className="bg-bg-card-dashboard border border-border-dashboard rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#fafafa]">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted-dashboard uppercase tracking-wider border-b border-border-dashboard">Image</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted-dashboard uppercase tracking-wider border-b border-border-dashboard">Title</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted-dashboard uppercase tracking-wider border-b border-border-dashboard">Uploaded</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted-dashboard uppercase tracking-wider border-b border-border-dashboard">Price</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted-dashboard uppercase tracking-wider border-b border-border-dashboard">Status</th>
              <th scope="col" className="relative px-6 py-4 border-b border-border-dashboard"><span className="sr-only">Edit</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border-dashboard">
            {recentUploads.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap"><img src={item.image} alt={item.title} className="h-10 w-10 rounded-md object-cover" /></td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-main-dashboard">{item.title}</div>
                  <div className="text-xs text-text-muted-dashboard">{item.medium}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-dashboard">{item.uploaded}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted-dashboard">{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusPill(item.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-text-muted-dashboard text-sm cursor-pointer hover:text-text-main-dashboard hover:underline">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 max-w-lg">
        <FileUpload /> {/* Keep the FileUpload component */}
      </div>
    </>
  );
}
