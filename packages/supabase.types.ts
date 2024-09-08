export type Json = { [key: string]: any } | any

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      tbl_inventory: {
        Row: {
          available_units: number | null
          base_price: string | null
          currency_code: string | null
          description: string | null
          discount_1: number | null
          discount_2: number | null
          discount_3: number | null
          inventory_id: string
          price_granularity:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null
          product_id: string | null
          product_metadata: Json | null
          store_id: string | null
          total_units: number | null
        }
        Insert: {
          available_units?: number | null
          base_price?: string | null
          currency_code?: string | null
          description?: string | null
          discount_1?: number | null
          discount_2?: number | null
          discount_3?: number | null
          inventory_id?: string
          price_granularity?:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null
          product_id?: string | null
          product_metadata?: Json | null
          store_id?: string | null
          total_units?: number | null
        }
        Update: {
          available_units?: number | null
          base_price?: string | null
          currency_code?: string | null
          description?: string | null
          discount_1?: number | null
          discount_2?: number | null
          discount_3?: number | null
          inventory_id?: string
          price_granularity?:
            | Database["public"]["Enums"]["enum_price_granularity_type"]
            | null
          product_id?: string | null
          product_metadata?: Json | null
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
        ]
      }
      tbl_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          experience: string[] | null
          gender: Database["public"]["Enums"]["enum_genders"] | null
          image_url: string | null
          market_price: string | null
          product_id: string
          product_link: string | null
          product_metadata: Json | null
          product_title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          experience?: string[] | null
          gender?: Database["public"]["Enums"]["enum_genders"] | null
          image_url?: string | null
          market_price?: string | null
          product_id?: string
          product_link?: string | null
          product_metadata?: Json | null
          product_title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          experience?: string[] | null
          gender?: Database["public"]["Enums"]["enum_genders"] | null
          image_url?: string | null
          market_price?: string | null
          product_id?: string
          product_link?: string | null
          product_metadata?: Json | null
          product_title?: string | null
        }
        Relationships: []
      }
      tbl_stores: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_email: string | null
          business_number: string | null
          city: string | null
          closing_time: string | null
          country: string | null
          description: string | null
          google_link: string | null
          google_rating: number | null
          postcode: string | null
          store_id: string
          store_img: string | null
          store_name: string
          user_id: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_email?: string | null
          business_number?: string | null
          city?: string | null
          closing_time?: string | null
          country?: string | null
          description?: string | null
          google_link?: string | null
          google_rating?: number | null
          postcode?: string | null
          store_id?: string
          store_img?: string | null
          store_name: string
          user_id: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_email?: string | null
          business_number?: string | null
          city?: string | null
          closing_time?: string | null
          country?: string | null
          description?: string | null
          google_link?: string | null
          google_rating?: number | null
          postcode?: string | null
          store_id?: string
          store_img?: string | null
          store_name?: string
          user_id?: string
        }
        Relationships: []
      }
      tbl_users: {
        Row: {
          created_at: string | null
          email: string | null
          email_confirmed: boolean | null
          is_admin: boolean | null
          name: string | null
          phone: string | null
          picture: string | null
          store_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_confirmed?: boolean | null
          is_admin?: boolean | null
          name?: string | null
          phone?: string | null
          picture?: string | null
          store_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_confirmed?: boolean | null
          is_admin?: boolean | null
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_business: {
        Args: {
          store_id_input?: string
        }
        Returns: Json
      }
      get_user_store_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      enum_genders: "male" | "female" | "unisex"
      enum_price_granularity_type: "daily" | "hourly"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
