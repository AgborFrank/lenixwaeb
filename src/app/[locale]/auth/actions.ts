"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    // Type-casting here for convenience
    // In a real app, you might want to use Zod for validation
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        await redirect("/login?error=authFailed");
    }

    // After login, check if user has completed web onboarding
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: onboarding } = await supabase
            .from("web_onboarding")
            .select("step_completed")
            .eq("user_id", user.id)
            .single();

        const completed = onboarding && (onboarding.step_completed ?? 0) >= 2;
        if (!completed) {
            revalidatePath("/", "layout");
            await redirect("/onboarding");
        }
    }

    revalidatePath("/", "layout");
    await redirect("/");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const host = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.signUp({
        ...data,
        options: {
            // Locale is applied in /[locale]/auth/callback from NEXT_LOCALE / default
            emailRedirectTo: `${host}/auth/callback?next=/dashboard`,
        },
    });

    if (error) {
        await redirect("/signup?error=createUserFailed");
    }

    revalidatePath("/", "layout");
    await redirect("/login?message=checkEmailConfirm");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    await redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const callbackUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`
        : "http://localhost:3000/auth/callback?next=/dashboard";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl,
    });

    if (error) {
        await redirect("/forgot-password?error=resetEmailFailed");
    }

    await redirect("/forgot-password?message=checkEmailReset");
}
