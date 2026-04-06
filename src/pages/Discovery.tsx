import { useState, useMemo } from "react";
import { Filter, Sparkles } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const allRoles = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "UI/UX Designer", "ML Engineer", "Mobile Developer", "DevOps Engineer", "Blockchain Developer"];
const levels = ["beginner", "intermediate", "advanced"] as const;

const Discovery = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showLikedYou, setShowLikedYou] = useState(false);
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", user!.id)
        .order("last_updated", { ascending: false });
      if (error) throw error;
      return data as Tables<"profiles">[];
    },
    enabled: !!user,
  });

  const { data: likesReceived = [] } = useQuery({
    queryKey: ["likes-received"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("from_user")
        .eq("to_user", user!.id);
      if (error) throw error;
      return data.map((l) => l.from_user);
    },
    enabled: !!user,
  });

  const { data: likesSent = [] } = useQuery({
    queryKey: ["likes-sent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("to_user")
        .eq("from_user", user!.id);
      if (error) throw error;
      return data.map((l) => l.to_user);
    },
    enabled: !!user,
  });

  const likeMutation = useMutation({
    mutationFn: async (toUserId: string) => {
      const { error } = await supabase
        .from("likes")
        .insert({ from_user: user!.id, to_user: toUserId });
      if (error) throw error;
    },
    onSuccess: (_data, toUserId) => {
      const isMutual = likesReceived.includes(toUserId);
      const profile = profiles.find((p) => p.user_id === toUserId);
      if (isMutual) {
        toast.success(`🎉 It's a match! You and ${profile?.name || "someone"} matched!`);
      } else {
        toast("❤️ Liked!", { description: `You liked ${profile?.name || "someone"}` });
      }
      queryClient.invalidateQueries({ queryKey: ["likes-sent"] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  const allSkills = useMemo(() => [...new Set(profiles.flatMap((p) => p.skills))], [profiles]);

  const toggleSkill = (s: string) =>
    setSelectedSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((p) => !likesSent.includes(p.user_id))
      .filter((p) => !passedProfiles.includes(p.user_id))
      .filter((p) => !selectedSkills.length || p.skills.some((s) => selectedSkills.includes(s)))
      .filter((p) => !selectedRole || p.preferred_role === selectedRole)
      .filter((p) => !selectedLevel || p.experience_level === selectedLevel)
      .filter((p) => !showLikedYou || likesReceived.includes(p.user_id));
  }, [profiles, likesSent, passedProfiles, selectedSkills, selectedRole, selectedLevel, showLikedYou, likesReceived]);

  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);

  const handleLike = (userId: string) => likeMutation.mutate(userId);
  const handlePass = (userId: string) => {
    setPassedProfiles((prev) => [...prev, userId]);
  };

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Discover</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Find your next teammate</p>
        </div>
        <Button variant="secondary" size="sm" className="rounded-xl" onClick={() => setShowFilters(!showFilters)}>
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
                <Badge key={skill} className={`cursor-pointer text-xs transition-all ${selectedSkills.includes(skill) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`} onClick={() => toggleSkill(skill)}>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Role</p>
            <div className="flex flex-wrap gap-1.5">
              {allRoles.map((role) => (
                <Badge key={role} className={`cursor-pointer text-xs transition-all ${selectedRole === role ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`} onClick={() => setSelectedRole(selectedRole === role ? null : role)}>
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Experience</p>
            <div className="flex gap-1.5">
              {levels.map((level) => (
                <Badge key={level} className={`cursor-pointer text-xs capitalize transition-all ${selectedLevel === level ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`} onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}>
                  {level}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No profiles found. Try adjusting filters!</p>
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              likedYou={likesReceived.includes(profile.user_id)}
              onLike={() => handleLike(profile.user_id)}
              onPass={() => handlePass(profile.user_id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Discovery;
