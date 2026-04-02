import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export default function PlaceholderPage({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-content-primary">{title}</h1>
        <p className="text-content-secondary mt-1">
          Manage your {title.toLowerCase()} here
        </p>
      </div>

      <Card className="bg-white border-surface-subtle rounded-3xl shadow-sm">
        <CardContent className="p-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-brand-light flex items-center justify-center text-brand">
            <Icon size={48} />
          </div>
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-content-primary">
              Coming Soon
            </h2>
            <p className="text-content-muted mt-2">
              The {title} management module is currently under development.
              Check back soon for updates on bus tracking, route planning, and
              more.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
