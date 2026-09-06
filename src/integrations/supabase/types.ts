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
      bulk_requirements: {
        Row: {
          buyer_id: string
          created_at: string
          crop_name: string
          id: string
          location_name: string | null
          purpose: string | null
          quantity: number
          required_by: string | null
          status: string
          unit: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          crop_name: string
          id?: string
          location_name?: string | null
          purpose?: string | null
          quantity: number
          required_by?: string | null
          status?: string
          unit?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          crop_name?: string
          id?: string
          location_name?: string | null
          purpose?: string | null
          quantity?: number
          required_by?: string | null
          status?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulk_requirements_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          id: string
          image_url: string | null
          order_id: string
          problem_type: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          image_url?: string | null
          order_id: string
          problem_type: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          image_url?: string | null
          order_id?: string
          problem_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          available_from: string | null
          category: string
          condition: string | null
          created_at: string
          description: string | null
          farmer_id: string
          harvest_period: string | null
          id: string
          image_url: string | null
          intended_use: string | null
          is_damaged: boolean
          is_demo: boolean
          labels: string[]
          lat: number | null
          lng: number | null
          location_name: string | null
          name: string
          price: number
          quantity: number
          status: string
          unit: string
        }
        Insert: {
          available_from?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          description?: string | null
          farmer_id: string
          harvest_period?: string | null
          id?: string
          image_url?: string | null
          intended_use?: string | null
          is_damaged?: boolean
          is_demo?: boolean
          labels?: string[]
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          name: string
          price?: number
          quantity?: number
          status?: string
          unit?: string
        }
        Update: {
          available_from?: string | null
          category?: string
          condition?: string | null
          created_at?: string
          description?: string | null
          farmer_id?: string
          harvest_period?: string | null
          id?: string
          image_url?: string | null
          intended_use?: string | null
          is_damaged?: boolean
          is_demo?: boolean
          labels?: string[]
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          name?: string
          price?: number
          quantity?: number
          status?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "crops_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_read: boolean
          profile_id: string
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id: string
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          crop_id: string | null
          crop_name: string
          id: string
          order_id: string
          quantity: number
          subtotal: number
          unit: string
          unit_price: number
        }
        Insert: {
          crop_id?: string | null
          crop_name: string
          id?: string
          order_id: string
          quantity: number
          subtotal: number
          unit?: string
          unit_price: number
        }
        Update: {
          crop_id?: string | null
          crop_name?: string
          id?: string
          order_id?: string
          quantity?: number
          subtotal?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          delivery_address: string | null
          farmer_id: string
          id: string
          order_no: number
          status: string
          total: number
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivery_address?: string | null
          farmer_id: string
          id?: string
          order_no?: number
          status?: string
          total?: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivery_address?: string | null
          farmer_id?: string
          id?: string
          order_no?: number
          status?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          crop_name: string
          id: string
          price: number
          recorded_at: string
          region: string | null
        }
        Insert: {
          crop_name: string
          id?: string
          price: number
          recorded_at?: string
          region?: string | null
        }
        Update: {
          crop_name?: string
          id?: string
          price?: number
          recorded_at?: string
          region?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[]
          created_at: string
          id: string
          is_demo: boolean
          language: string
          lat: number | null
          lng: number | null
          location_name: string | null
          name: string
          phone: string | null
          role: string
          trust_score: number
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[]
          created_at?: string
          id?: string
          is_demo?: boolean
          language?: string
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          name?: string
          phone?: string | null
          role?: string
          trust_score?: number
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[]
          created_at?: string
          id?: string
          is_demo?: boolean
          language?: string
          lat?: number | null
          lng?: number | null
          location_name?: string | null
          name?: string
          phone?: string | null
          role?: string
          trust_score?: number
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      my_profile_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
