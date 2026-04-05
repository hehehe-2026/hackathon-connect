import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChatWindow from "@/components/ChatWindow";
import { mockMatches, type Match } from "@/data/mockData";

const Matches = () => {
  const [activeChat, setActiveChat] = useState<Match | null>(null);

  if (activeChat) {
    return (
      <div className="pt-2 px-0">
        <ChatWindow match={activeChat} onBack={() => setActiveChat(null)} />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold gradient-text">Matches</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{mockMatches.length} teammates found</p>
      </div>

      {mockMatches.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No matches yet. Keep discovering!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className="glass-card rounded-2xl p-4 animate-slide-up cursor-pointer hover:border-primary/30 transition-all"
              onClick={() => setActiveChat(match)}
            >
              <div className="flex items-center gap-3">
                <img src={match.user.avatar} alt={match.user.name} className="w-12 h-12 rounded-xl bg-secondary" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{match.user.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.user.skills.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                  {match.lastMessage && (
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">{match.lastMessage}</p>
                  )}
                </div>
                <Button size="icon" variant="secondary" className="rounded-xl shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
