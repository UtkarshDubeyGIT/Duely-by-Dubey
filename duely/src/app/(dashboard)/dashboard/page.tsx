import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardOverview data={data} />;
}
