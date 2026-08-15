import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export function ApplicationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Job pipeline"
        title="Applications"
        description="Track applied companies, interview rounds, outcomes and follow-ups."
        action={<Button>Add application</Button>}
      />

      <Card>
        <p className="text-sm text-slate-400">
          Application tracker module will be built soon.
        </p>
      </Card>
    </div>
  );
}