"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Set auth cookie (expires in 1 day)
    document.cookie = "auth_token=1; path=/; max-age=86400; SameSite=Lax";
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-surface-page">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 p-6">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/assets/authlogo.jpg"
            alt="Grand Lake Landscape"
            fill
            className="object-cover brightness-75"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-content-primary tracking-tight">
              Welcome
            </h1>
            <p className="mt-2 text-content-secondary">
              Enter details to login
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-content-primary"
                  htmlFor="username"
                >
                  Enter Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Type here"
                  className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-content-primary"
                  htmlFor="password"
                >
                  Enter Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Type here"
                    className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-content-secondary hover:text-brand transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
