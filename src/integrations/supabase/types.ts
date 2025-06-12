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
      companies: {
        Row: {
          cnpj: string | null
          created_at: string
          id: string
          name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      company_services: {
        Row: {
          active: boolean | null
          company_id: string | null
          created_at: string
          exam_id: string | null
          id: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string
          exam_id?: string | null
          id?: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string
          exam_id?: string | null
          id?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_services_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          preparation: string | null
          updated_at: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          preparation?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          preparation?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          active: boolean | null
          address: string
          city: string
          company_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          active?: boolean | null
          address: string
          city: string
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string
          company_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          quantity: number | null
          service_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          service_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          quantity?: number | null
          service_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "company_services"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          location_id: string | null
          patient_cpf: string
          patient_name: string
          patient_phone: string | null
          scheduled_date: string | null
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          patient_cpf: string
          patient_name: string
          patient_phone?: string | null
          scheduled_date?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          patient_cpf?: string
          patient_name?: string
          patient_phone?: string | null
          scheduled_date?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
