import { Heart, X, Github, ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/data/mockData";
import { useState } from "react";

interface ProfileCardProps {
  profile: UserProfile;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

const ProfileCard = ({ profile, onLike, onPass }: ProfileCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState<"like" | "pass" | null>(null);

  const handleAction = (action: "like" | "pass") => {
    setAnimating(action);
    setTimeout(() => {
      if (action === "like") onLike(profile.id);
      else onPass(profile.id);
    }, 300);
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 animate-scale-in transition-all duration-300 ${
        animating === "like" ? "translate-x-20 opacity-0 rotate-6" :
        animating === "pass" ? "-translate-x-20 opacity-0 -rotate-6" : ""
      }`}
    >
      {profile.likedYou && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
            <Sparkles className="w-3 h-3 mr-1" /> Liked you
          </Badge>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-16 h-16 rounded-2xl bg-secondary object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg text-foreground truncate">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">{profile.college}</p>
          <p className="text-xs text-primary font-medium mt-1">{profile.preferredRole}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {profile.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs font-medium bg-secondary/80">
            {skill}
          </Badge>
        ))}
      </div>

      {expanded && (
        <div className="animate-fade-in mb-3">
          <p className="text-sm text-muted-foreground mb-2">{profile.bio}</p>
          <a
            href={profile.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Github className="w-3.5 h-3.5" /> GitHub Profile
          </a>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
      >
        {expanded ? "Less" : "View more"}
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <div className="flex items-center gap-3 mt-4">
        <Button
          onClick={() => handleAction("pass")}
          variant="secondary"
          size="lg"
          className="flex-1 rounded-xl"
        >
          <X className="w-5 h-5 mr-1" /> Pass
        </Button>
        <Button
          onClick={() => handleAction("like")}
          size="lg"
          className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Heart className="w-5 h-5 mr-1" /> Like
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
