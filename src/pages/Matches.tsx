import { useState } from "react";
import { MessageCircle, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MatchWithProfile {
  match: Tables<"matches">;
  otherUser: Tables<"profiles">;
  lastMessage?: string;
}

const Matches = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeMatch, setActiveMatch] = useState<MatchWithProfile | null>(null);

  const { data: matchesWithProfiles = [] } = useQuery({
    queryKey: ["matches"],
    queryFn: async () => {
      const { data: matches, error } = await supabase
        .from("matches")
        .select("*")
        .or(`user1.eq.${user!.id},user2.eq.${user!.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const results: MatchWithProfile[] = [];
      for (const match of matches) {
        const otherUserId = match.user1 === user!.id ? match.user2 : match.user1;
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", otherUserId)
          .single();

        const { data: lastMsg } = await supabase
          .from("messages")
          .select("text")
          .eq("match_id", match.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (profile) {
          results.push({ match, otherUser: profile, lastMessage: lastMsg?.text });
        }
      }
      return results;
    },
    enabled: !!user,
  });

  const unmatchMutation = useMutation({
    mutationFn: async ({ matchId, otherUserId }: { matchId: string; otherUserId: string }) => {
      // Delete messages for this match
      await supabase.from("messages").delete().eq("match_id", matchId);
      // Delete the match
      await supabase.from("matches").delete().eq("id", matchId);
      // Delete mutual likes
      await supabase.from("likes").delete().eq("from_user", user!.id).eq("to_user", otherUserId);
      await supabase.from("likes").delete().eq("from_user", otherUserId).eq("to_user", user!.id);
    },
    onSuccess: () => {
      toast.success("Unmatched successfully");
      setActiveMatch(null);
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["matched-user-ids"] });
      queryClient.invalidateQueries({ queryKey: ["likes-sent"] });
      queryClient.invalidateQueries({ queryKey: ["likes-received"] });
    },
  });

  if (activeMatch) {
    return (
      <div className="pt-2 px-0">
        <ChatWindow
          match={activeMatch.match}
          otherUser={activeMatch.otherUser}
          onBack={() => setActiveMatch(null)}
          onUnmatch={() => unmatchMutation.mutate({ matchId: activeMatch.match.id, otherUserId: activeMatch.otherUser.user_id })}
        />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold gradient-text">Matches</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{matchesWithProfiles.length} teammates found</p>
      </div>

      {matchesWithProfiles.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No matches yet. Keep discovering!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matchesWithProfiles.map((mwp) => (
            <div
              key={mwp.match.id}
              className="glass-card rounded-2xl p-4 animate-slide-up cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={mwp.otherUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mwp.otherUser.name}`}
                  alt={mwp.otherUser.name}
                  className="w-12 h-12 rounded-xl bg-secondary"
                  onClick={() => setActiveMatch(mwp)}
                />
                <div className="flex-1 min-w-0" onClick={() => setActiveMatch(mwp)}>
                  <h3 className="font-display font-semibold text-foreground">{mwp.otherUser.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mwp.otherUser.skills.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                  {mwp.lastMessage && (
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">{mwp.lastMessage}</p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="icon" variant="secondary" className="rounded-xl" onClick={() => setActiveMatch(mwp)}>
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="secondary" className="rounded-xl text-destructive hover:bg-destructive/10">
                        <UserX className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unmatch {mwp.otherUser.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the match and delete all chat messages between you. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => unmatchMutation.mutate({ matchId: mwp.match.id, otherUserId: mwp.otherUser.user_id })}
                        >
                          Unmatch
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
