import { useState, useMemo, useRef } from "react";
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
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Swipe gesture state
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

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
      .filter((p) => !selectedSkills.length || p.skills.some((s) => selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())))
      .filter((p) => !selectedRole || p.preferred_role.toLowerCase() === selectedRole.toLowerCase())
      .filter((p) => !selectedLevel || p.experience_level === selectedLevel)
      .filter((p) => !showLikedYou || likesReceived.includes(p.user_id));
  }, [profiles, likesSent, passedProfiles, selectedSkills, selectedRole, selectedLevel, showLikedYou, likesReceived]);

  const currentProfile = filteredProfiles[0] || null;

  const handleSwipeAction = (direction: "left" | "right") => {
    if (!currentProfile) return;
    setSwipeDirection(direction);
    setTimeout(() => {
      if (direction === "right") {
        likeMutation.mutate(currentProfile.user_id);
      } else {
        setPassedProfiles((prev) => [...prev, currentProfile.user_id]);
      }
      setSwipeDirection(null);
      setDragOffset(0);
    }, 300);
  };

  // Touch / mouse handlers for swipe gestures
  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    currentX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.clientX;
    setDragOffset(currentX.current - startX.current);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 100;
    if (dragOffset > threshold) {
      handleSwipeAction("right");
    } else if (dragOffset < -threshold) {
      handleSwipeAction("left");
    } else {
      setDragOffset(0);
    }
  };

  const getCardStyle = (): React.CSSProperties => {
    if (swipeDirection === "right") {
      return { transform: "translateX(150%) rotate(20deg)", opacity: 0, transition: "all 0.3s ease-out" };
    }
    if (swipeDirection === "left") {
      return { transform: "translateX(-150%) rotate(-20deg)", opacity: 0, transition: "all 0.3s ease-out" };
    }
    if (dragOffset !== 0) {
      const rotate = dragOffset * 0.1;
      return { transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`, transition: "none" };
    }
    return { transform: "translateX(0) rotate(0deg)", transition: "all 0.2s ease-out" };
  };

  const swipeIndicator = dragOffset > 50 ? "like" : dragOffset < -50 ? "pass" : null;

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold gradient-text">Discover</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Swipe to find teammates</p>
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

      <div className="relative flex items-center justify-center min-h-[420px]">
        {currentProfile ? (
          <div
            ref={cardRef}
            className="w-full max-w-sm select-none touch-none relative"
            style={getCardStyle()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {/* Swipe indicators */}
            {swipeIndicator === "like" && (
              <div className="absolute top-6 left-6 z-20 border-4 border-green-500 text-green-500 rounded-xl px-4 py-2 font-bold text-2xl rotate-[-15deg] opacity-80">
                LIKE
              </div>
            )}
            {swipeIndicator === "pass" && (
              <div className="absolute top-6 right-6 z-20 border-4 border-destructive text-destructive rounded-xl px-4 py-2 font-bold text-2xl rotate-[15deg] opacity-80">
                PASS
              </div>
            )}

            <ProfileCard
              profile={currentProfile}
              likedYou={likesReceived.includes(currentProfile.user_id)}
              onLike={() => handleSwipeAction("right")}
              onPass={() => handleSwipeAction("left")}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No more profiles. Try adjusting filters!</p>
          </div>
        )}
      </div>

      {currentProfile && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? "s" : ""} remaining
        </p>
      )}
    </div>
  );
};

export default Discovery;
