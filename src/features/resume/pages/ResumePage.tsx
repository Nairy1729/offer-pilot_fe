import { UploadCloud } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export function ResumePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resume manager"
        title="Resume"
        description="Upload resumes, manage versions and keep your active resume ready."
        action={
          <Button>
            <UploadCloud size={18} />
            Upload resume
          </Button>
        }
      />

      <Card>
        <p className="text-sm text-slate-400">
          Resume versioning module will be built soon.
        </p>
      </Card>
    </div>
  );
}