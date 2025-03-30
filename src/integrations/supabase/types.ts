export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audio_files: {
        Row: {
          audio_type: string | null
          created_at: string
          generated_audio_url: string | null
          generated_script: string | null
          id: string
          journal_entry_id: string | null
          user_id: string
        }
        Insert: {
          audio_type?: string | null
          created_at?: string
          generated_audio_url?: string | null
          generated_script?: string | null
          id?: string
          journal_entry_id?: string | null
          user_id: string
        }
        Update: {
          audio_type?: string | null
          created_at?: string
          generated_audio_url?: string | null
          generated_script?: string | null
          id?: string
          journal_entry_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_files_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string
          end_time: string
          event_description: string | null
          event_title: string
          external_event_id: string | null
          id: string
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          event_description?: string | null
          event_title: string
          external_event_id?: string | null
          id?: string
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          event_description?: string | null
          event_title?: string
          external_event_id?: string | null
          id?: string
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          created_at: string
          entry_date: string | null
          generated_audio_id: string | null
          id: string
          photo_urls: Json | null
          text_content: string | null
          updated_at: string
          user_id: string
          voice_audio_url: string | null
          voice_transcript: string | null
        }
        Insert: {
          created_at?: string
          entry_date?: string | null
          generated_audio_id?: string | null
          id?: string
          photo_urls?: Json | null
          text_content?: string | null
          updated_at?: string
          user_id: string
          voice_audio_url?: string | null
          voice_transcript?: string | null
        }
        Update: {
          created_at?: string
          entry_date?: string | null
          generated_audio_id?: string | null
          id?: string
          photo_urls?: Json | null
          text_content?: string | null
          updated_at?: string
          user_id?: string
          voice_audio_url?: string | null
          voice_transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_generated_audio"
            columns: ["generated_audio_id"]
            isOneToOne: false
            referencedRelation: "audio_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          created_at: string
          id: string
          prompt_text: string
          prompt_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          prompt_text: string
          prompt_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          prompt_text?: string
          prompt_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          calendar_token: Json | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          notification_preferences: string | null
          subscription_status: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          auth_id: string
          calendar_token?: Json | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notification_preferences?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          auth_id?: string
          calendar_token?: Json | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          notification_preferences?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
