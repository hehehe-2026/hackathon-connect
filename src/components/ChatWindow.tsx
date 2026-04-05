import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Match, Message } from "@/data/mockData";
import { mockMessages } from "@/data/mockData";
import { format } from "date-fns";

interface ChatWindowProps {
  match: Match;
  onBack: () => void;
}

const ChatWindow = ({ match, onBack }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages[match.id] || []);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      text: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <img src={match.user.avatar} alt={match.user.name} className="w-10 h-10 rounded-xl bg-secondary" />
        <div>
          <h3 className="font-display font-semibold text-foreground">{match.user.name}</h3>
          <p className="text-xs text-muted-foreground">{match.user.preferredRole}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.senderId === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "glass-card text-foreground rounded-bl-md"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.senderId === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                {format(msg.timestamp, "h:mm a")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl bg-secondary border-border"
        />
        <Button
          onClick={sendMessage}
          size="icon"
          className="rounded-xl bg-primary text-primary-foreground"
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
