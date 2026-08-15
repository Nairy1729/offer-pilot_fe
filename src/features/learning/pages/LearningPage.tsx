import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/ui/card";

export function LearningPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Skill progress"
        title="Learning Tracker"
        description="Track DSA, Spring Boot, System Design and React preparation."
      />

      <Card>
        <p className="text-sm text-slate-400">
          Learning tracker module will be built soon.
        </p>
      </Card>
    </div>
  );
}