"use client";

import type { BaseComponentProps } from "@json-render/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {} from "react";

interface SectionProps {
  title?: string | undefined;
  subtitle?: string | undefined;
}

function SectionImpl({ props, children }: BaseComponentProps<SectionProps>) {
  return (
    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      {props.title && (
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            {props.title}
          </CardTitle>
          {props.subtitle && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {props.subtitle}
            </p>
          )}
        </CardHeader>
      )}
      <CardContent className="p-4 md:p-6">{children}</CardContent>
    </Card>
  );
}

export const Section = SectionImpl;
