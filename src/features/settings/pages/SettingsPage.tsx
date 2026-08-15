import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace settings"
        title="Settings"
        description="Manage account settings, notifications and preferences."
      />

      <Card>
        <p className="text-sm text-slate-400">
          Settings module will be built soon.
        </p>
      </Card>
    </div>
  );
}