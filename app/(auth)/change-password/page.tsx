'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    document.cookie = "auth_token=1; path=/; max-age=86400; SameSite=Lax";
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-surface-page">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 p-6">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://picsum.photos/seed/grandlake-transit-2/1200/1600"
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
            <h1 className="text-4xl font-bold text-content-primary tracking-tight">Change Password</h1>
            <p className="mt-2 text-content-secondary">Create a new password before proceeding</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSave}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-content-primary" htmlFor="old-password">
                  Enter Old Password
                </label>
                <div className="relative">
                  <Input
                    id="old-password"
                    type={showOld ? 'text' : 'password'}
                    placeholder="Type here"
                    className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-content-primary" htmlFor="new-password">
                  Enter New Password
                </label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    placeholder="Type here"
                    className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-content-primary" htmlFor="confirm-password">
                  Re-enter New Password
                </label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Type here"
                    className="h-12 bg-white border-surface-subtle focus:ring-brand focus:border-brand pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-semibold rounded-full transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save New Password and Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
