import { Resend } from "resend";
import { isResendConfigured } from "@/lib/env";

export const resend = isResendConfigured() ? new Resend(process.env.RESEND_API_KEY) : null;

export const resendFromEmail =
  process.env.RESEND_FROM_EMAIL?.trim() || "Duely <reminders@duely.tech>";
