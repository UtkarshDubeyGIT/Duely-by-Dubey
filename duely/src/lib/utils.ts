import { clsx, type ClassValue } from "clsx"
import { differenceInDays, format, isPast } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string) {
  return format(new Date(`${date}T00:00:00`), "MMM d, yyyy");
}

export function daysOverdue(dueDate: string) {
  return Math.max(0, differenceInDays(new Date(), new Date(`${dueDate}T00:00:00`)));
}

export function isOverdue(dueDate: string, status: string) {
  return status === "pending" && isPast(new Date(`${dueDate}T23:59:59`));
}

export function generateInvoiceNumber(count: number) {
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
