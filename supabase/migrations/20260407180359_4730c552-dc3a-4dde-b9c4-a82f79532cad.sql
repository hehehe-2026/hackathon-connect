
-- Create passes table
CREATE TABLE public.passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user uuid NOT NULL,
  to_user uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(from_user, to_user)
);

ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own passes" ON public.passes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user);

CREATE POLICY "Users can view their own passes" ON public.passes
  FOR SELECT TO authenticated USING (auth.uid() = from_user);

-- Allow deleting matches (for unmatch)
CREATE POLICY "Users can delete their own matches" ON public.matches
  FOR DELETE TO authenticated USING (auth.uid() = user1 OR auth.uid() = user2);

-- Allow deleting likes (cleanup on unmatch)
CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE TO authenticated USING (auth.uid() = from_user OR auth.uid() = to_user);

-- Allow deleting messages (cleanup on unmatch)
CREATE POLICY "Users can delete messages in their matches" ON public.messages
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user1 = auth.uid() OR matches.user2 = auth.uid())
    )
  );
