import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppLoader } from "@/components/shared/AppLoader";
import { cn } from "@/lib/utils";

function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {action ? <Skeleton className="h-10 w-36 rounded-lg" /> : null}
    </div>
  );
}

function TableSkeleton({
  columns = 6,
  rows = 6,
  className,
}: {
  columns?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, columnIndex) => (
                  <TableCell key={columnIndex}>
                    <Skeleton
                      className={cn(
                        "h-5",
                        columnIndex === 0 ? "w-32" : "w-24",
                        columnIndex > 3 && "ml-auto",
                      )}
                    />
                    {columnIndex === 0 ? (
                      <Skeleton className="mt-2 h-3 w-44" />
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <TableSkeleton
            columns={5}
            rows={5}
            className="rounded-none border-0 shadow-none"
          />
        </Card>

        <Card className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="divide-y divide-zinc-100 p-0 dark:divide-zinc-800">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ClientTableSkeleton() {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      <TableSkeleton columns={6} rows={7} />
    </div>
  );
}

export function InvoiceTableSkeleton() {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton />
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:flex-row">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg md:w-48" />
      </div>
      <TableSkeleton columns={6} rows={7} />
    </div>
  );
}

export function ReminderTimelineSkeleton() {
  return (
    <div className="space-y-4">
      <PageHeaderSkeleton action={false} />
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-52 max-w-full" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InvoiceDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:gap-6">
      <div className="min-w-0 space-y-5">
        <Card className="border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardHeader className="px-5 sm:px-6">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 sm:px-6">
            <Skeleton className="h-24 rounded-lg sm:col-span-2" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
            <Skeleton className="h-20 rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-5 sm:px-6">
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-3 px-5 sm:px-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex justify-between gap-4">
                <Skeleton className="h-5 w-48 max-w-full" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="px-5 sm:px-6">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-4 px-5 sm:px-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-lg" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AppRouteLoader() {
  return <AppLoader className="min-h-dvh" />;
}
