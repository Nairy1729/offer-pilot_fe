import { useState } from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { APP_ROUTES } from "../../../lib/constants";
import { AuthLayout } from "../components/AuthLayout";
import { forgotPasswordSchema } from "../schemas/authSchemas";
import type { ForgotPasswordFormValues } from "../types/auth.types";

export function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmittedEmail(values.email);
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email and we will send instructions to help you regain access."
      footer={
        <Link
          to={APP_ROUTES.LOGIN}
          className="inline-flex items-center gap-2 font-medium text-brand-300 hover:text-brand-200"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      }
    >
      {submittedEmail ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <MailCheck size={22} />
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            Check your inbox
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            If an account exists for{" "}
            <span className="font-medium text-slate-200">{submittedEmail}</span>,
            password reset instructions will be sent shortly.
          </p>

          <Link to={APP_ROUTES.LOGIN}>
  <Button className="mt-5 w-full">Return to login</Button>
</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-200"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />

            {errors.email ? (
              <p className="text-sm text-red-300">{errors.email.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending instructions...
              </>
            ) : (
              "Send reset instructions"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}