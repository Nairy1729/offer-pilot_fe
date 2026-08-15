import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { APP_ROUTES } from "../../../lib/constants";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { resetPasswordSchema } from "../schemas/authSchemas";
import type { ResetPasswordFormValues } from "../types/auth.types";

export function ResetPasswordPage() {
  const [resetComplete, setResetComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Reset password form submitted", values);
    setResetComplete(true);
  }

  return (
    <AuthLayout
      title="Create new password"
      description="Choose a strong password to secure your OfferPilot account."
      footer={
        <>
          Remember your password?{" "}
          <Link
            to={APP_ROUTES.LOGIN}
            className="font-medium text-brand-300 hover:text-brand-200"
          >
            Sign in
          </Link>
        </>
      }
    >
      {resetComplete ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <CheckCircle2 size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            Password updated
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Your password has been changed successfully. You can now sign in
            with your new password.
          </p>

<Link to={APP_ROUTES.LOGIN}>
  <Button className="mt-5 w-full">Go to login</Button>
</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              New password
            </label>

            <PasswordInput
              id="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              {...register("password")}
            />

            {errors.password ? (
              <p className="text-sm text-red-300">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-200"
            >
              Confirm new password
            </label>

            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword ? (
              <p className="text-sm text-red-300">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating password...
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}