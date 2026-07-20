import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/login-form";
import { BrandMark } from "@/components/brand-mark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organiser login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <main
      id="main"
      className="aurora flex min-h-screen items-center justify-center px-6 py-16"
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <BrandMark className="h-11 w-11" />
          <h1 className="mt-7 font-display text-3xl font-light text-foreground">
            Organiser access
          </h1>
          <p className="mt-2.5 text-sm text-muted-foreground">
            Enter the admin password to view bookings.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
