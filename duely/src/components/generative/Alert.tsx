"use client";

import type { BaseComponentProps } from "@json-render/react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bell,
  Info,
} from "lucide-react";
import type {} from "react";

interface AlertProps {
  severity: "info" | "warning" | "danger";
  title: string;
  body?: string | undefined;
  actionLabel?: string | undefined;
}

const config = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-100 dark:border-blue-950/40",
    text: "text-blue-800 dark:text-blue-300",
    bodyText: "text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    icon: Bell,
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-100 dark:border-amber-950/40",
    text: "text-amber-800 dark:text-amber-300",
    bodyText: "text-amber-700 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    icon: AlertTriangle,
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-100 dark:border-red-950/40",
    text: "text-red-800 dark:text-red-300",
    bodyText: "text-red-700 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
  },
};

function AlertImpl({ props }: BaseComponentProps<AlertProps>) {
  const { severity, title, body, actionLabel } = props;
  const { icon: Icon, bg, border, text, bodyText, iconColor } =
    config[severity];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex items-start gap-3 shadow-sm",
        bg,
        border
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", text)}>{title}</p>
        {body && (
          <p className={cn("text-sm mt-1", bodyText)}>{body}</p>
        )}
        {actionLabel && (
          <button
            className={cn(
              "mt-2 text-sm font-semibold underline underline-offset-2",
              text
            )}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export const Alert = AlertImpl;
