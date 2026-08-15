import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/ui/card";

export function ProfilePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="User profile"
        title="Profile"
        description="Manage your career profile, experience, notice period and preferences."
      />

      <Card>
        <p className="text-sm text-slate-400">
          Profile module will be built soon.
        </p>
      </Card>
    </div>
  );
}