"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/products");
    }
  }, [isAuthenticated, loading, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const result = await login(data.username, data.password);

      if (result.success) {
        router.push("/products");
      } else {
        setSubmitError(result.error || "Login failed");
      }
    } catch (error) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E268D4]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efaee7] dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Lotus Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to access the product dashboard
          </p>
        </div>

        <Card className="bg-[#E268D4]">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submitError && (
                <div className="rounded-md bg-[#E268D4] dark:bg-red-900/20 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        {submitError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Username"
                {...register("username")}
                error={errors.username?.message}
                placeholder="Enter your username"
                autoComplete="username"
                disabled={isSubmitting}
              />

              <Input
                label="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-[#E268D4]  dark:bg-blue-900/20 rounded-md">
              <h3 className="text-sm font-medium text-black dark:text-blue-200 mb-2">
                Demo Credentials
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Username: <strong>admin</strong>
                <br />
                Password: <strong>password</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
