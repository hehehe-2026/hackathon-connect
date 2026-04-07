import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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

interface ChatWindowProps {
  match: Tables<"matches">;
  otherUser: Tables<"profiles">;
  onBack: () => void;
  onUnmatch?: () => void;
}

const ChatWindow = ({ match, otherUser, onBack, onUnmatch }: ChatWindowProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", match.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", match.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    refetchInterval: 3000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      const { error } = await supabase.from("messages").insert({
        match_id: match.id,
        sender_id: user!.id,
        text,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", match.id] });
      setInput("");
    },
  });

  const sendMessage = () => {
    if (!input.trim()) return;
    sendMutation.mutate(input.trim());
  };

  const avatarUrl = otherUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.name}`;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-xl bg-secondary" />
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground">{otherUser.name}</h3>
          <p className="text-xs text-muted-foreground">{otherUser.preferred_role}</p>
        </div>
        {onUnmatch && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl text-destructive">
                <UserX className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unmatch {otherUser.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the match and delete all chat messages. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={onUnmatch}>
                  Unmatch
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === user!.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              msg.sender_id === user!.id
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "glass-card text-foreground rounded-bl-md"
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender_id === user!.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {format(new Date(msg.created_at), "h:mm a")}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl bg-secondary border-border"
        />
        <Button onClick={sendMessage} size="icon" className="rounded-xl bg-primary text-primary-foreground" disabled={!input.trim() || sendMutation.isPending}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
