export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      hackathons: {
        Row: {
          created_at: string
          created_by: string | null
          deadline: string
          description: string
          end_date: string
          id: string
          interested_count: number
          mode: Database["public"]["Enums"]["hackathon_mode"]
          organization: string
          poster_url: string
          prize: string
          registration_link: string
          start_date: string
          status: Database["public"]["Enums"]["hackathon_status"]
          title: string
          venue: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deadline: string
          description?: string
          end_date: string
          id?: string
          interested_count?: number
          mode?: Database["public"]["Enums"]["hackathon_mode"]
          organization: string
          poster_url?: string
          prize?: string
          registration_link?: string
          start_date: string
          status?: Database["public"]["Enums"]["hackathon_status"]
          title: string
          venue?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deadline?: string
          description?: string
          end_date?: string
          id?: string
          interested_count?: number
          mode?: Database["public"]["Enums"]["hackathon_mode"]
          organization?: string
          poster_url?: string
          prize?: string
          registration_link?: string
          start_date?: string
          status?: Database["public"]["Enums"]["hackathon_status"]
          title?: string
          venue?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          from_user: string
          id: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          to_user?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          user1: string
          user2: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1: string
          user2: string
        }
        Update: {
          created_at?: string
          id?: string
          user1?: string
          user2?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          id: string
          match_id: string
          sender_id: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          sender_id: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          sender_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      passes: {
        Row: {
          created_at: string
          from_user: string
          id: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          to_user?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          bio: string
          college: string
          created_at: string
          email: string | null
          experience_level: Database["public"]["Enums"]["experience_level"]
          github_link: string
          id: string
          last_updated: string
          name: string
          preferred_role: string
          skills: string[]
          user_id: string
        }
        Insert: {
          avatar_url?: string
          bio?: string
          college?: string
          created_at?: string
          email?: string | null
          experience_level?: Database["public"]["Enums"]["experience_level"]
          github_link?: string
          id?: string
          last_updated?: string
          name?: string
          preferred_role?: string
          skills?: string[]
          user_id: string
        }
        Update: {
          avatar_url?: string
          bio?: string
          college?: string
          created_at?: string
          email?: string | null
          experience_level?: Database["public"]["Enums"]["experience_level"]
          github_link?: string
          id?: string
          last_updated?: string
          name?: string
          preferred_role?: string
          skills?: string[]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      experience_level: "beginner" | "intermediate" | "advanced"
      hackathon_mode: "online" | "offline" | "hybrid"
      hackathon_status: "upcoming" | "ongoing" | "ended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      experience_level: ["beginner", "intermediate", "advanced"],
      hackathon_mode: ["online", "offline", "hybrid"],
      hackathon_status: ["upcoming", "ongoing", "ended"],
    },
  },
} as const
