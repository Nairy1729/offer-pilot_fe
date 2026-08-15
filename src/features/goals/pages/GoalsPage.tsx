import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/ui/card";

export function GoalsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Career target"
        title="Goals"
        description="Define your target role, salary, companies and preparation deadline."
      />

      <Card>
        <p className="text-sm text-slate-400">
          Goal setup module will be built soon.
        </p>
      </Card>
    </div>
  );
}