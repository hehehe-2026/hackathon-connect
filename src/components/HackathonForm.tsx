import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface HackathonFormProps {
  onBack: () => void;
}

const HackathonForm = ({ onBack }: HackathonFormProps) => {
  const [form, setForm] = useState({
    title: "", organization: "", description: "", posterImage: "",
    startDate: "", endDate: "", registrationDeadline: "",
    venue: "", mode: "online", prizeDetails: "", registrationLink: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Hackathon posted successfully! 🎉");
    onBack();
  };

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-display text-xl font-bold text-foreground">Post a Hackathon</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: "title", label: "Hackathon Title", type: "text" },
          { key: "organization", label: "Organization", type: "text" },
          { key: "startDate", label: "Start Date", type: "date" },
          { key: "endDate", label: "End Date", type: "date" },
          { key: "registrationDeadline", label: "Registration Deadline", type: "date" },
          { key: "venue", label: "Venue / Location", type: "text" },
          { key: "prizeDetails", label: "Prize Details", type: "text" },
          { key: "registrationLink", label: "Registration Link", type: "url" },
          { key: "posterImage", label: "Poster Image URL", type: "url" },
        ].map(({ key, label, type }) => (
          <div key={key}>
            <Label className="text-sm text-muted-foreground">{label}</Label>
            <Input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={(e) => update(key, e.target.value)}
              className="mt-1 rounded-xl bg-secondary border-border"
              required
            />
          </div>
        ))}

        <div>
          <Label className="text-sm text-muted-foreground">Mode</Label>
          <div className="flex gap-2 mt-1">
            {["online", "offline", "hybrid"].map((m) => (
              <Button
                key={m}
                type="button"
                variant={form.mode === m ? "default" : "secondary"}
                size="sm"
                className={`rounded-xl capitalize text-xs ${form.mode === m ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => update("mode", m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="mt-1 rounded-xl bg-secondary border-border min-h-[100px]"
            required
          />
        </div>

        <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground">
          Post Hackathon
        </Button>
      </form>
    </div>
  );
};

export default HackathonForm;
