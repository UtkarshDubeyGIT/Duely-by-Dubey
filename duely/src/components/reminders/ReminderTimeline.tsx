import type { ReminderLog } from "@/types";
import { ToneBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function ReminderTimeline({ logs }: { logs: ReminderLog[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-zinc-950">Reminder log</h2>
        <p className="text-sm text-zinc-500">Every manual and automated reminder in one audit trail.</p>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="divide-y divide-zinc-100">
          {logs.map((log) => (
            <div key={log.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-semibold text-zinc-950">{log.invoice?.invoice_number}</p>
                  <ToneBadge tone={log.tone} />
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">{log.type}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{log.client?.name} via {log.channel}</p>
                {log.error_message ? <p className="mt-1 text-xs text-red-600">{log.error_message}</p> : null}
              </div>
              <p className="text-sm text-zinc-500">{formatDate(log.sent_at.slice(0, 10))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
