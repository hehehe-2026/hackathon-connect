import { useState, useMemo } from "react";
import { Filter, Sparkles } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProfiles } from "@/data/mockData";
import { toast } from "sonner";

const allSkills = [...new Set(mockProfiles.flatMap((p) => p.skills))];
const allRoles = [...new Set(mockProfiles.map((p) => p.preferredRole))];
const levels = ["beginner", "intermediate", "advanced"] as const;

const Discovery = () => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showLikedYou, setShowLikedYou] = useState(false);

  const toggleSkill = (s: string) =>
    setSelectedSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const profiles = useMemo(() => {
    return mockProfiles
      .filter((p) => !dismissed.has(p.id))
      .filter((p) => !selectedSkills.length || p.skills.some((s) => selectedSkills.includes(s)))
      .filter((p) => !selectedRole || p.preferredRole === selectedRole)
      .filter((p) => !selectedLevel || p.experienceLevel === selectedLevel)
      .filter((p) => !showLikedYou || p.likedYou)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  }, [dismissed, selectedSkills, selectedRole, selectedLevel, showLikedYou]);

  const handleLike = (id: string) => {
    const profile = mockProfiles.find((p) => p.id === id);
    if (profile?.likedYou) {
      toast.success(`🎉 It's a match! You and ${profile.name} matched!`);
    } else {
      toast("❤️ Liked!", { description: `You liked ${profile?.name}` });
    }
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handlePass = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Discover</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find your next teammate</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-1" /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="glass-card rounded-2xl p-4 mb-5 animate-slide-up space-y-4">
          <div>
            <Button
              variant={showLikedYou ? "default" : "secondary"}
              size="sm"
              className={`rounded-xl text-xs mb-3 ${showLikedYou ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setShowLikedYou(!showLikedYou)}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Liked You / Match Requests
            </Button>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {allSkills.map((skill) => (
                <Badge
                  key={skill}
                  className={`cursor-pointer text-xs transition-all ${
                    selectedSkills.includes(skill) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {allRoles.map((role) => (
                <Badge
                  key={role}
                  className={`cursor-pointer text-xs transition-all ${
                    selectedRole === role ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Experience</p>
            <div className="flex gap-1.5">
              {levels.map((level) => (
                <Badge
                  key={level}
                  className={`cursor-pointer text-xs capitalize transition-all ${
                    selectedLevel === level ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  }`}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {profiles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No profiles found. Try adjusting filters!</p>
          </div>
        ) : (
          profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} onLike={handleLike} onPass={handlePass} />
          ))
        )}
      </div>
    </div>
  );
};

export default Discovery;
