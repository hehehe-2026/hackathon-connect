
-- Create experience level enum
CREATE TYPE public.experience_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Create hackathon mode enum
CREATE TYPE public.hackathon_mode AS ENUM ('online', 'offline', 'hybrid');

-- Create hackathon status enum
CREATE TYPE public.hackathon_status AS ENUM ('upcoming', 'ongoing', 'ended');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  college TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  preferred_role TEXT NOT NULL DEFAULT '',
  experience_level experience_level NOT NULL DEFAULT 'beginner',
  github_link TEXT NOT NULL DEFAULT '',
  avatar_url TEXT NOT NULL DEFAULT '',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by all authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(from_user, to_user)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create likes" ON public.likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user);
CREATE POLICY "Users can view likes involving them" ON public.likes FOR SELECT TO authenticated USING (auth.uid() = from_user OR auth.uid() = to_user);

-- Matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1, user2)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = user1 OR auth.uid() = user2);

-- Messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their matches" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.matches WHERE matches.id = messages.match_id AND (matches.user1 = auth.uid() OR matches.user2 = auth.uid())));
CREATE POLICY "Users can send messages in their matches" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.matches WHERE matches.id = messages.match_id AND (matches.user1 = auth.uid() OR matches.user2 = auth.uid())));

-- Hackathons table
CREATE TABLE public.hackathons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  poster_url TEXT NOT NULL DEFAULT '',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  mode hackathon_mode NOT NULL DEFAULT 'online',
  prize TEXT NOT NULL DEFAULT '',
  registration_link TEXT NOT NULL DEFAULT '',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interested_count INTEGER NOT NULL DEFAULT 0,
  status hackathon_status NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hackathons viewable by all authenticated" ON public.hackathons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create hackathons" ON public.hackathons FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Function to update last_updated
CREATE OR REPLACE FUNCTION public.update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_last_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_last_updated();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create match on mutual like
CREATE OR REPLACE FUNCTION public.handle_new_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.likes WHERE from_user = NEW.to_user AND to_user = NEW.from_user
  ) INTO mutual_exists;

  IF mutual_exists THEN
    INSERT INTO public.matches (user1, user2)
    VALUES (LEAST(NEW.from_user, NEW.to_user), GREATEST(NEW.from_user, NEW.to_user))
    ON CONFLICT (user1, user2) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_like();

-- Index for message lookup
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_likes_to_user ON public.likes(to_user);
CREATE INDEX idx_profiles_last_updated ON public.profiles(last_updated DESC);
