import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (!form.name.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.name);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to confirm, or sign in if auto-confirmed.");
      }
    } else {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">NEXORA</h1>
          <p className="text-muted-foreground text-sm">Hackathon Buddy Finder</p>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-scale-in">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-1 rounded-xl bg-secondary border-border"
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1 rounded-xl bg-secondary border-border"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="mt-1 rounded-xl bg-secondary border-border"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
