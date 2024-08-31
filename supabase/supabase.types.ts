export type Json = { [key: string]: any } | any;

export type Database = {
  public: {
    Tables: {
      tbl_inventory: {
        Row: {
          available_units: number | null;
          base_price: string | null;
          currency_code: string | null;
          description: string | null;
          discount_1: number | null;
          discount_2: number | null;
          discount_3: number | null;
          inventory_id: string;
          price_granularity:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null;
          product_id: string | null;
          product_metadata: Json | null;
          store_id: string | null;
          total_units: number | null;
        };
        Insert: {
          available_units?: number | null;
          base_price?: string | null;
          currency_code?: string | null;
          description?: string | null;
          discount_1?: number | null;
          discount_2?: number | null;
          discount_3?: number | null;
          inventory_id?: string;
          price_granularity?:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null;
          product_id?: string | null;
          product_metadata?: Json | null;
          store_id?: string | null;
          total_units?: number | null;
        };
        Update: {
          available_units?: number | null;
          base_price?: string | null;
          currency_code?: string | null;
          description?: string | null;
          discount_1?: number | null;
          discount_2?: number | null;
          discount_3?: number | null;
          inventory_id?: string;
          price_granularity?:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null;
          product_id?: string | null;
          product_metadata?: Json | null;
          store_id?: string | null;
          total_units?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "tbl_inventory_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "tbl_products";
            referencedColumns: ["product_id"];
          },
          {
            foreignKeyName: "tbl_inventory_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "tbl_stores";
            referencedColumns: ["store_id"];
          },
        ];
      };
      tbl_products: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          experience: string[] | null;
          gender: Database["public"]["Enums"]["enum_genders"] | null;
          image_url: string | null;
          market_price: string | null;
          product_id: string;
          product_link: string | null;
          product_metadata: Json | null;
          product_title: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          experience?: string[] | null;
          gender?: Database["public"]["Enums"]["enum_genders"] | null;
          image_url?: string | null;
          market_price?: string | null;
          product_id?: string;
          product_link?: string | null;
          product_metadata?: Json | null;
          product_title?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          experience?: string[] | null;
          gender?: Database["public"]["Enums"]["enum_genders"] | null;
          image_url?: string | null;
          market_price?: string | null;
          product_id?: string;
          product_link?: string | null;
          product_metadata?: Json | null;
          product_title?: string | null;
        };
        Relationships: [];
      };
      tbl_stores: {
        Row: {
          address: string | null;
          business_email: string | null;
          business_number: string | null;
          closing_time: string | null;
          description: string | null;
          google_link: string | null;
          google_rating: number | null;
          store_id: string;
          store_img: string | null;
          store_name: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          business_email?: string | null;
          business_number?: string | null;
          closing_time?: string | null;
          description?: string | null;
          google_link?: string | null;
          google_rating?: number | null;
          store_id?: string;
          store_img?: string | null;
          store_name: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          business_email?: string | null;
          business_number?: string | null;
          closing_time?: string | null;
          description?: string | null;
          google_link?: string | null;
          google_rating?: number | null;
          store_id?: string;
          store_img?: string | null;
          store_name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      tbl_users: {
        Row: {
          created_at: string | null;
          email: string | null;
          is_admin: boolean | null;
          name: string | null;
          phone: string | null;
          picture: string | null;
          store_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          is_admin?: boolean | null;
          name?: string | null;
          phone?: string | null;
          picture?: string | null;
          store_id?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          is_admin?: boolean | null;
          name?: string | null;
          phone?: string | null;
          picture?: string | null;
          store_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tbl_users_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "tbl_stores";
            referencedColumns: ["store_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_inventory: {
        Args: {
          store_id_input: string;
        };
        Returns: Json;
      };
      get_user_store_ids: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
    };
    Enums: {
      enum_genders: "male" | "female" | "unisex";
      enum_price_granularity_type: "daily" | "hourly";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

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
  : never;
