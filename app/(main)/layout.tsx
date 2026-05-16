import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";
import AuthProvider from "@/components/authProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-full min-h-screen bg-white font-sans">
        <Sidebar />
        <div className="flex-1 lg:ml-64 flex flex-col min-w-0 min-h-screen">
          <Topbar />
          <main className="flex-1 p-6 sm:p-6 lg:p-8 min-w-0">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
