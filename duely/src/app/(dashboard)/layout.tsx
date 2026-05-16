import { MobileNav } from "@/components/shared/MobileNav";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <MobileNav />
    </SidebarProvider>
  );
}
