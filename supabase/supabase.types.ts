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
      tbl_inventory: {
        Row: {
          available_units: number | null
          inventory_id: string
          product_id: string | null
          store_id: string | null
          total_units: number | null
        }
        Insert: {
          available_units?: number | null
          inventory_id?: string
          product_id?: string | null
          store_id?: string | null
          total_units?: number | null
        }
        Update: {
          available_units?: number | null
          inventory_id?: string
          product_id?: string | null
          store_id?: string | null
          total_units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tbl_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "tbl_inventory_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "tbl_stores"
            referencedColumns: ["store_id"]
          },
          {
            foreignKeyName: "tbl_inventory_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "view_stores_inventory"
            referencedColumns: ["store_id"]
          },
        ]
      }
      tbl_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          image_url: string | null
          product_id: string
          product_link: string | null
          product_metadata: Json | null
          product_title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          product_id?: string
          product_link?: string | null
          product_metadata?: Json | null
          product_title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          image_url?: string | null
          product_id?: string
          product_link?: string | null
          product_metadata?: Json | null
          product_title?: string | null
        }
        Relationships: []
      }
      tbl_stores: {
        Row: {
          address: string | null
          business_email: string | null
          business_number: string | null
          closing_time: string | null
          description: string | null
          google_link: string | null
          google_rating: number | null
          store_id: string
          store_img: string | null
          store_name: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_email?: string | null
          business_number?: string | null
          closing_time?: string | null
          description?: string | null
          google_link?: string | null
          google_rating?: number | null
          store_id?: string
          store_img?: string | null
          store_name: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_email?: string | null
          business_number?: string | null
          closing_time?: string | null
          description?: string | null
          google_link?: string | null
          google_rating?: number | null
          store_id?: string
          store_img?: string | null
          store_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "tbl_stores"
            referencedColumns: ["store_id"]
          },
          {
            foreignKeyName: "tbl_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "view_stores_inventory"
            referencedColumns: ["store_id"]
          },
        ]
      }
      tbl_users: {
        Row: {
          created_at: string | null
          email: string | null
          name: string | null
          phone: string | null
          picture: string | null
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          picture?: string | null
          store_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          picture?: string | null
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tbl_users_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "tbl_stores"
            referencedColumns: ["store_id"]
          },
          {
            foreignKeyName: "tbl_users_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "view_stores_inventory"
            referencedColumns: ["store_id"]
          },
        ]
      }
    }
    Views: {
      view_stores_inventory: {
        Row: {
          address: string | null
          available_units: number | null
          business_email: string | null
          business_number: string | null
          category: string | null
          google_rating: number | null
          inventory_id: string | null
          product_description: string | null
          product_id: string | null
          product_title: string | null
          store_description: string | null
          store_id: string | null
          store_name: string | null
          total_units: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbl_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "tbl_products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "tbl_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "tbl_stores"
            referencedColumns: ["store_id"]
          },
          {
            foreignKeyName: "tbl_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "view_stores_inventory"
            referencedColumns: ["store_id"]
          },
        ]
      }
    }
    Functions: {
      get_user_store_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
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
