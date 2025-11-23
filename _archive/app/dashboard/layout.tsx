import Sidebar from '@/components/sidebar'; // Assuming we'll create this

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-body-dashboard">
      <Sidebar /> {/* Sidebar component */}
      <main className="flex-grow p-12 px-16 ml-64"> {/* Adjust ml for sidebar width */}
        {children}
      </main>
    </div>
  );
}
