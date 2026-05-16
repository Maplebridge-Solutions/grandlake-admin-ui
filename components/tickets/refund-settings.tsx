"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function RefundSettings() {
  const [settings, setSettings] = useState({
    selfService: true,
    partialRefunds: false,
    expirationBlock: true,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-content-primary tracking-tight">
          Refund Auto-Settings
        </h2>
        <p className="text-content-muted mt-1">
          Manage automatic refund settings here
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Self-Service Window */}
        <div className="p-6 bg-surface-page border border-surface-subtle rounded-[24px] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-content-primary">
                Self-Service Window
              </h3>
              <Switch
                checked={settings.selfService}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, selfService: checked }))
                }
              />
            </div>
            <p className="text-sm text-content-muted leading-relaxed">
              Allow users to get a 100% refund automatically if they cancel
              within 5 minutes of buying.
            </p>
          </div>
        </div>

        {/* Partial Refunds */}
        <div className="p-6 bg-surface-page border border-surface-subtle rounded-[24px] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-content-primary">
                Partial Refunds
              </h3>
              <Switch
                checked={settings.partialRefunds}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, partialRefunds: checked }))
                }
              />
            </div>
            <p className="text-sm text-content-muted leading-relaxed">
              For multi-use or period passes, the system deducts used portions
              and refunds only the unused ticket value.
            </p>
          </div>
        </div>

        {/* Expiration Block */}
        <div className="p-6 bg-surface-page border border-surface-subtle rounded-[24px] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-content-primary">
                Expiration Block
              </h3>
              <Switch
                checked={settings.expirationBlock}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, expirationBlock: checked }))
                }
              />
            </div>
            <p className="text-sm text-content-muted leading-relaxed">
              Automatically block any refund requests for tickets that expired
              more than 24 hours ago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
