import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

interface HackathonCardProps {
  hackathon: Tables<"hackathons">;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const [interested, setInterested] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const modeColors: Record<string, string> = {
    online: "bg-accent/20 text-accent border-accent/30",
    offline: "bg-primary/20 text-primary border-primary/30",
    hybrid: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  };

  const statusColors: Record<string, string> = {
    upcoming: "bg-primary/20 text-primary",
    ongoing: "bg-accent/20 text-accent",
    ended: "bg-muted text-muted-foreground",
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
      {hackathon.poster_url && (
        <div className="relative h-40 overflow-hidden">
          <img src={hackathon.poster_url} alt={hackathon.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={modeColors[hackathon.mode]}>{hackathon.mode}</Badge>
            <Badge className={statusColors[hackathon.status]}>{hackathon.status}</Badge>
          </div>
        </div>
      )}
      {!hackathon.poster_url && (
        <div className="flex gap-2 p-4 pb-0">
          <Badge className={modeColors[hackathon.mode]}>{hackathon.mode}</Badge>
          <Badge className={statusColors[hackathon.status]}>{hackathon.status}</Badge>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-foreground">{hackathon.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{hackathon.organization}</p>

        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {format(new Date(hackathon.start_date), "MMM d")} – {format(new Date(hackathon.end_date), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {hackathon.venue || "TBD"}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            {hackathon.interested_count + (interested ? 1 : 0)} interested
          </span>
        </div>

        {expanded && (
          <div className="animate-fade-in mb-3">
            <p className="text-sm text-muted-foreground mb-2">{hackathon.description}</p>
            <p className="text-sm font-medium text-foreground">🏆 {hackathon.prize}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Registration deadline: {format(new Date(hackathon.deadline), "MMM d, yyyy")}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <Button variant="secondary" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Less" : "Details"}
          </Button>
          <Button
            variant={interested ? "default" : "secondary"}
            size="sm"
            className={`rounded-xl text-xs ${interested ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setInterested(!interested)}
          >
            {interested ? "✓ Interested" : "Interested"}
          </Button>
          {hackathon.registration_link && (
            <Button size="sm" className="rounded-xl text-xs bg-primary text-primary-foreground" asChild>
              <a href={hackathon.registration_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Register
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
