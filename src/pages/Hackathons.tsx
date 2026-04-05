import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HackathonCard from "@/components/HackathonCard";
import HackathonForm from "@/components/HackathonForm";
import { mockHackathons } from "@/data/mockData";

const modeFilters = ["all", "online", "offline", "hybrid"] as const;
const statusFilters = ["all", "upcoming", "ongoing"] as const;

const Hackathons = () => {
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = mockHackathons
    .filter((h) => modeFilter === "all" || h.mode === modeFilter)
    .filter((h) => statusFilter === "all" || h.status === statusFilter);

  if (showForm) return <HackathonForm onBack={() => setShowForm(false)} />;

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Hackathons</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Discover & compete</p>
        </div>
        <Button size="sm" className="rounded-xl bg-primary text-primary-foreground" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Post
        </Button>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {modeFilters.map((m) => (
          <Badge
            key={m}
            className={`cursor-pointer capitalize text-xs whitespace-nowrap transition-all ${
              modeFilter === m ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setModeFilter(m)}
          >
            {m}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {statusFilters.map((s) => (
          <Badge
            key={s}
            className={`cursor-pointer capitalize text-xs whitespace-nowrap transition-all ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No hackathons found.</p>
        ) : (
          filtered.map((h) => <HackathonCard key={h.id} hackathon={h} />)
        )}
      </div>
    </div>
  );
};

export default Hackathons;
