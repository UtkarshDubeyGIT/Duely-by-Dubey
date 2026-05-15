"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations";

export async function loginAction(_previous: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  if (!supabase) {
    if (parsed.data.email === "demo@duely.tech" && parsed.data.password === "Duely@2025") {
      redirect("/dashboard");
    }
    return { error: "Supabase is not configured. Use demo@duely.tech / Duely@2025 for local demo mode." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signupAction(_previous: unknown, formData: FormData) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Complete all signup fields." };
  }

  const supabase = await createClient();
  if (!supabase) {
    redirect("/dashboard");
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
        business_name: parsed.data.business_name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
