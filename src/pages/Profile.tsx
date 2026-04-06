import { useState, useEffect } from "react";
import { Github, Save, X, Plus, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [form, setForm] = useState({
    name: "",
    college: "",
    bio: "",
    skills: [] as string[],
    preferred_role: "",
    experience_level: "beginner" as "beginner" | "intermediate" | "advanced",
    github_link: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        college: profile.college,
        bio: profile.bio,
        skills: profile.skills,
        preferred_role: profile.preferred_role,
        experience_level: profile.experience_level,
        github_link: profile.github_link,
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update(form)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setEditing(false);
      toast.success("Profile updated! You'll appear in discovery feeds again.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", user!.id);
      if (error) throw error;
      await supabase.auth.signOut();
    },
    onSuccess: () => {
      toast.success("Account deleted.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      setForm((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold gradient-text">Profile</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground"
            onClick={editing ? () => updateMutation.mutate() : () => setEditing(true)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? <><Save className="w-4 h-4 mr-1" /> Save</> : "Edit"}
          </Button>
          <Button size="sm" variant="secondary" className="rounded-xl" onClick={signOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 animate-scale-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
            <img
              src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name || "user"}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            {editing ? (
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="rounded-xl bg-secondary border-border mb-2 font-display font-semibold" />
            ) : (
              <h2 className="font-display text-xl font-semibold text-foreground">{form.name || "Set your name"}</h2>
            )}
            {editing ? (
              <Input value={form.college} onChange={(e) => update("college", e.target.value)} className="rounded-xl bg-secondary border-border text-sm" placeholder="Your college" />
            ) : (
              <p className="text-sm text-muted-foreground">{form.college || "Add your college"}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">Bio</Label>
            {editing ? (
              <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            ) : (
              <p className="text-sm text-foreground mt-1">{form.bio || "Tell others about yourself"}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Skills</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="ml-1"><X className="w-3 h-3" /></button>
                  )}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-2">
                <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add skill..." className="rounded-xl bg-secondary border-border text-sm flex-1" />
                <Button size="icon" variant="secondary" className="rounded-xl" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Preferred Role</Label>
            {editing ? (
              <Input value={form.preferred_role} onChange={(e) => update("preferred_role", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border text-sm" />
            ) : (
              <p className="text-sm text-primary font-medium mt-1">{form.preferred_role || "Set your role"}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Experience Level</Label>
            {editing ? (
              <div className="flex gap-2 mt-1">
                {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                  <Button key={lvl} type="button" variant={form.experience_level === lvl ? "default" : "secondary"} size="sm" className={`rounded-xl capitalize text-xs ${form.experience_level === lvl ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setForm((p) => ({ ...p, experience_level: lvl }))}>
                    {lvl}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground mt-1 capitalize">{form.experience_level}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">GitHub</Label>
            {editing ? (
              <Input value={form.github_link} onChange={(e) => update("github_link", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border text-sm" />
            ) : (
              form.github_link ? (
                <a href={form.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-1">
                  <Github className="w-4 h-4" /> {form.github_link}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Add your GitHub link</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
