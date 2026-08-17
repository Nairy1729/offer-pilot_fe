import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { APP_ROUTES } from "../../../lib/constants";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { signupSchema } from "../schemas/authSchemas";
import type { SignupFormValues } from "../types/auth.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage, getApiFieldErrors } from "../../../services/apiError";
import { useAuthStore } from "../store/authStore";
import { registerUser } from "../services/authService";

export function SignupPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setSubmitError(null);

    try {
      const session = await registerUser(values);

      setSession(session);

      navigate(APP_ROUTES.DASHBOARD, {
        replace: true,
      });
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          if (
            field === "fullName" ||
            field === "email" ||
            field === "password" ||
            field === "confirmPassword"
          ) {
            setError(field, {
              type: "server",
              message,
            });
          }
        });
      }

      setSubmitError(
        getApiErrorMessage(error, "Unable to create account. Please try again.")
      );
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start building a focused execution system for your target software engineering offer."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={APP_ROUTES.LOGIN}
            className="font-medium text-brand-300 hover:text-brand-200"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium text-slate-200"
          >
            Full name
          </label>

          <Input
            id="fullName"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            {...register("fullName")}
          />

          {errors.fullName ? (
            <p className="text-sm text-red-300">{errors.fullName.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-200">
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

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-200"
          >
            Password
          </label>

          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            {...register("password")}
          />

          {errors.password ? (
            <p className="text-sm text-red-300">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-slate-500">
              Use at least 8 characters with uppercase, lowercase and a number.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-200"
          >
            Confirm password
          </label>

          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}