'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  const nextSteps = [
    "Check your spam folder if you don't see the email.",
    "The reset link will expire in 24 hours.",
    "Contact support if you still can't log in."
  ];

  return (
    <div className="flex min-h-screen bg-surface-page items-center justify-center p-6">
      {!isSent ? (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-subtle p-10 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-content-primary tracking-tight">Forgot Password</h1>
            <p className="mt-2 text-content-secondary">Enter your email to receive a reset link</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-content-primary" htmlFor="email">
                Enter Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Type here"
                className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Reset Link
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm font-medium text-content-secondary hover:text-brand transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-surface-subtle p-12 text-center space-y-8 relative">
          <Link href="/" className="absolute top-6 right-6 text-content-muted hover:text-content-primary">
            <X size={24} />
          </Link>
          
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center text-brand">
              <CheckCircle2 size={48} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-content-primary tracking-tight">Link Sent</h1>
              <p className="text-content-secondary leading-relaxed">
                A password reset link has been sent to your registered email address. Please click on the link to begin the process.
              </p>
            </div>

            <div className="w-full space-y-3 text-left bg-surface-page p-4 rounded-2xl border border-surface-subtle">
              <p className="text-xs font-bold text-content-primary uppercase tracking-wider">Next Steps:</p>
              <ul className="space-y-2">
                {nextSteps.map((step, i) => (
                  <li key={i} className="text-sm text-content-secondary flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link 
            href="/" 
            className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-semibold rounded-full transition-all flex items-center justify-center"
          >
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}
