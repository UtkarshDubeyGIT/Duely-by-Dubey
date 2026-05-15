import { ReminderTimeline } from "@/components/reminders/ReminderTimeline";
import { getReminderLogs } from "@/lib/data";

export default async function RemindersPage() {
  const logs = await getReminderLogs();
  return <ReminderTimeline logs={logs} />;
}
