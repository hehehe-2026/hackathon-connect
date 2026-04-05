import { useState } from "react";
import { Github, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "You",
    college: "Your College",
    bio: "Passionate developer looking for hackathon teammates!",
    skills: ["React", "TypeScript", "Node.js"],
    preferredRole: "Full Stack Developer",
    experienceLevel: "intermediate" as const,
    githubLink: "https://github.com/yourusername",
  });
  const [newSkill, setNewSkill] = useState("");

  const update = (key: string, value: string) => setProfile((p) => ({ ...p, [key]: value }));

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const handleSave = () => {
    setEditing(false);
    toast.success("Profile updated! You'll appear in discovery feeds again.");
  };

  return (
    <div className="pb-24 pt-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold gradient-text">Profile</h1>
        <Button
          size="sm"
          className="rounded-xl bg-primary text-primary-foreground"
          onClick={editing ? handleSave : () => setEditing(true)}
        >
          {editing ? <><Save className="w-4 h-4 mr-1" /> Save</> : "Edit"}
        </Button>
      </div>

      <div className="glass-card rounded-2xl p-6 animate-scale-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <div className="flex-1">
            {editing ? (
              <Input value={profile.name} onChange={(e) => update("name", e.target.value)} className="rounded-xl bg-secondary border-border mb-2 font-display font-semibold" />
            ) : (
              <h2 className="font-display text-xl font-semibold text-foreground">{profile.name}</h2>
            )}
            {editing ? (
              <Input value={profile.college} onChange={(e) => update("college", e.target.value)} className="rounded-xl bg-secondary border-border text-sm" />
            ) : (
              <p className="text-sm text-muted-foreground">{profile.college}</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">Bio</Label>
            {editing ? (
              <Textarea value={profile.bio} onChange={(e) => update("bio", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border" />
            ) : (
              <p className="text-sm text-foreground mt-1">{profile.bio}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Skills</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add skill..."
                  className="rounded-xl bg-secondary border-border text-sm flex-1"
                />
                <Button size="icon" variant="secondary" className="rounded-xl" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Preferred Role</Label>
            {editing ? (
              <Input value={profile.preferredRole} onChange={(e) => update("preferredRole", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border text-sm" />
            ) : (
              <p className="text-sm text-primary font-medium mt-1">{profile.preferredRole}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Experience Level</Label>
            {editing ? (
              <div className="flex gap-2 mt-1">
                {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                  <Button
                    key={lvl}
                    type="button"
                    variant={profile.experienceLevel === lvl ? "default" : "secondary"}
                    size="sm"
                    className={`rounded-xl capitalize text-xs ${profile.experienceLevel === lvl ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => setProfile((p) => ({ ...p, experienceLevel: lvl }))}
                  >
                    {lvl}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-foreground mt-1 capitalize">{profile.experienceLevel}</p>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">GitHub</Label>
            {editing ? (
              <Input value={profile.githubLink} onChange={(e) => update("githubLink", e.target.value)} className="mt-1 rounded-xl bg-secondary border-border text-sm" />
            ) : (
              <a href={profile.githubLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-1">
                <Github className="w-4 h-4" /> {profile.githubLink}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
