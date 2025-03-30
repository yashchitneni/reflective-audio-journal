
export interface UserProfile {
  id: string;
  auth_id: string;
  display_name: string | null;
  email: string | null;
  notification_preferences: string | null;
  timezone: string | null;
  calendar_token: any | null;
  subscription_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  text_content: string | null;
  voice_transcript: string | null;
  photo_urls: string[] | null;
  voice_audio_url: string | null;
  generated_audio_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AudioFile {
  id: string;
  user_id: string;
  journal_entry_id: string | null;
  generated_script: string | null;
  generated_audio_url: string | null;
  audio_type: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  external_event_id: string | null;
  event_title: string;
  event_description: string | null;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  prompt_text: string;
  prompt_type: string | null;
  created_at: string;
  updated_at: string;
}
