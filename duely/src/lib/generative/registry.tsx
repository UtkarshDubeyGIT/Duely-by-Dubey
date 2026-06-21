"use client";

import { defineRegistry } from "@json-render/react";
import type { Actions } from "@json-render/react";
import { catalog, type Catalog } from "./catalog";

import { Grid } from "@/components/generative/layout/Grid";
import { Stack } from "@/components/generative/layout/Stack";
import { Section } from "@/components/generative/layout/Section";
import { StatCard } from "@/components/generative/StatCard";
import { LineChart } from "@/components/generative/LineChart";
import { BarChart } from "@/components/generative/BarChart";
import { DonutChart } from "@/components/generative/DonutChart";
import { DataTable } from "@/components/generative/DataTable";
import { Alert } from "@/components/generative/Alert";
import { BadgeCluster } from "@/components/generative/BadgeCluster";
import { InsightList } from "@/components/generative/InsightList";
import { EmptyState } from "@/components/generative/EmptyState";

const components = {
  Stack,
  Grid,
  Section,
  StatCard,
  LineChart,
  BarChart,
  DonutChart,
  DataTable,
  Alert,
  BadgeCluster,
  InsightList,
  EmptyState,
};

const actions = {
  openInvoice: async () => {},
  navigate: async () => {},
} satisfies Actions<Catalog>;

export function createRegistry() {
  const result = defineRegistry(catalog, {
    components,
    actions,
  });

  return result;
}
