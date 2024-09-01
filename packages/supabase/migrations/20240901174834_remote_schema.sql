SET statement_timeout = 0
SET lock_timeout = 0
SET idle_in_transaction_session_timeout = 0
SET client_encoding = 'UTF8'
SET standard_conforming_strings = on
SELECT pg_catalog.set_config('search_path', '', false)
SET check_function_bodies = false
SET xmloption = content
SET client_min_messages = warning
SET row_security = off
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium"
COMMENT ON SCHEMA "public" IS 'standard public schema'
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql"
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions"
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault"
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions"
CREATE TYPE "public"."enum_genders" AS ENUM (
    'male',
    'female',
    'unisex'
)
ALTER TYPE "public"."enum_genders" OWNER TO "postgres"
CREATE TYPE "public"."enum_price_granularity_type" AS ENUM (
    'daily',
    'hourly'
)
ALTER TYPE "public"."enum_price_granularity_type" OWNER TO "postgres"
CREATE OR REPLACE FUNCTION "public"."get_inventory"("store_id_input" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    return_data JSONB;
BEGIN
    SELECT 
        jsonb_build_object(
            'store_details', (
                SELECT jsonb_build_object(
                    'store_id', store_id,
                    'store_name', store_name,
                    'description', description,
                    'business_email', business_email,
                    'business_number', business_number,
                    'address', address,
                    'store_img', store_img
                )
                FROM tbl_stores
                WHERE store_id = store_id_input
            ),
            'inventory', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'inventory_id', i.inventory_id,
                        'product_id', i.product_id,
                        'product_title', p.product_title,
                        'product_metadata', p.product_metadata,
                        'category', p.category,
                        'base_price', i.base_price,
                        'currency_code', i.currency_code,
                        'price_granularity', i.price_granularity,
                        'available_units', i.available_units,
                        'total_units', i.total_units,
                        'discount_1', i.discount_1,
                        'discount_2', i.discount_2,
                        'discount_3', i.discount_3
                    )
                )
                FROM tbl_inventory i
                LEFT JOIN tbl_products p ON p.product_id = i.product_id
                WHERE store_id = store_id_input
            )
        ) INTO return_data;

    RETURN return_data;
END;
$$
ALTER FUNCTION "public"."get_inventory"("store_id_input" "uuid") OWNER TO "postgres"
CREATE OR REPLACE FUNCTION "public"."get_user_store_ids"() RETURNS SETOF "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  store_ids JSONB;
BEGIN
  SELECT COALESCE(raw_app_meta_data->'store_ids', '[]'::jsonb)
  INTO store_ids
  FROM auth.users
  WHERE id = auth.uid();

  RETURN QUERY 
  SELECT (jsonb_array_elements_text(store_ids))::UUID;
END;
$$
ALTER FUNCTION "public"."get_user_store_ids"() OWNER TO "postgres"
CREATE OR REPLACE FUNCTION "public"."remove_user_store_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$DECLARE
  user_id_input UUID;
  current_store_ids UUID[];
  updated_store_ids UUID[];
BEGIN
  -- Get the user_id of the store owner
  SELECT user_id INTO user_id_input
  FROM tbl_stores
  WHERE store_id = OLD.store_id;

  -- Get current store_ids from auth.users
  SELECT COALESCE((raw_app_meta_data->>'store_ids')::jsonb, '[]')::UUID[]
  INTO current_store_ids
  FROM auth.users
  WHERE id = user_id_input;

  -- Remove the deleted store ID from the array
  SELECT ARRAY(SELECT unnest(current_store_ids) EXCEPT SELECT OLD.store_id)
  INTO updated_store_ids;

  -- Update raw_app_metadata with new store_ids array
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{store_ids}',
    to_jsonb(updated_store_ids)
  )
  WHERE id = user_id_input;

  -- Update tbl_users to remove the store_id if it matches the deleted store
  UPDATE tbl_users
  SET store_id = NULL
  WHERE user_id = user_id_input AND store_id = OLD.store_id;

  RETURN OLD;
END;$$
ALTER FUNCTION "public"."remove_user_store_id"() OWNER TO "postgres"
CREATE OR REPLACE FUNCTION "public"."tigger_update_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  INSERT INTO public.tbl_users (user_id, email, name, phone, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.phone,
    NEW.created_at
  );
  RETURN NEW;
END;$$
ALTER FUNCTION "public"."tigger_update_new_user"() OWNER TO "postgres"
CREATE OR REPLACE FUNCTION "public"."update_user_store_ids"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id_input UUID;
  current_store_ids JSONB;
  updated_store_ids JSONB;
BEGIN
  -- Assume that NEW.user_id contains the user ID of the store owner
  user_id_input := NEW.user_id;

  -- Get current store_ids as JSONB
  SELECT COALESCE(raw_app_meta_data->'store_ids', '[]'::jsonb)
  INTO current_store_ids
  FROM auth.users
  WHERE id = user_id_input;

  -- Add new store ID to the JSONB array
  updated_store_ids := current_store_ids || to_jsonb(NEW.store_id);

  -- Update raw_app_metadata with new store_ids array
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{store_ids}',
    updated_store_ids
  )
  WHERE id = user_id_input;

  -- Update tbl_users
  UPDATE tbl_users u
  SET store_id = NEW.store_id
  WHERE u.user_id = user_id_input;

  RETURN NEW;
END;
$$
ALTER FUNCTION "public"."update_user_store_ids"() OWNER TO "postgres"
SET default_tablespace = ''
SET default_table_access_method = "heap"
CREATE TABLE IF NOT EXISTS "public"."tbl_inventory" (
    "product_id" "uuid",
    "store_id" "uuid",
    "total_units" integer,
    "available_units" integer,
    "inventory_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "base_price" "text",
    "currency_code" "text",
    "price_granularity" "public"."enum_price_granularity_type" DEFAULT 'daily'::"public"."enum_price_granularity_type",
    "discount_1" numeric,
    "discount_2" numeric,
    "discount_3" numeric,
    "description" "text",
    "product_metadata" "jsonb"
)
ALTER TABLE "public"."tbl_inventory" OWNER TO "postgres"
COMMENT ON COLUMN "public"."tbl_inventory"."discount_1" IS 'Discount for 3-7 days'
COMMENT ON COLUMN "public"."tbl_inventory"."discount_2" IS 'Discount for 7-14 days'
COMMENT ON COLUMN "public"."tbl_inventory"."discount_3" IS 'Discount for 14 days or more'
CREATE TABLE IF NOT EXISTS "public"."tbl_products" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "image_url" "text",
    "product_title" "text",
    "description" "text",
    "category" "text",
    "product_link" "text",
    "product_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_metadata" "jsonb",
    "gender" "public"."enum_genders",
    "market_price" "text",
    "experience" "text"[]
)
ALTER TABLE "public"."tbl_products" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."tbl_stores" (
    "store_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "google_link" "text",
    "store_name" "text" NOT NULL,
    "google_rating" numeric,
    "description" "text",
    "address" "text",
    "closing_time" "text",
    "business_number" "text",
    "store_img" "text",
    "business_email" "text",
    "user_id" "uuid" NOT NULL
)
ALTER TABLE "public"."tbl_stores" OWNER TO "postgres"
CREATE TABLE IF NOT EXISTS "public"."tbl_users" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text",
    "phone" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "store_id" "uuid",
    "name" "text",
    "picture" "text",
    "is_admin" boolean
)
ALTER TABLE "public"."tbl_users" OWNER TO "postgres"
ALTER TABLE ONLY "public"."tbl_inventory"
    ADD CONSTRAINT "tbl_inventory_pkey" PRIMARY KEY ("inventory_id")
ALTER TABLE ONLY "public"."tbl_products"
    ADD CONSTRAINT "tbl_products_id_key" UNIQUE ("product_id")
ALTER TABLE ONLY "public"."tbl_products"
    ADD CONSTRAINT "tbl_products_pkey" PRIMARY KEY ("product_id")
ALTER TABLE ONLY "public"."tbl_stores"
    ADD CONSTRAINT "tbl_stores_pkey" PRIMARY KEY ("store_id", "user_id")
ALTER TABLE ONLY "public"."tbl_stores"
    ADD CONSTRAINT "tbl_stores_store_id_key" UNIQUE ("store_id")
ALTER TABLE ONLY "public"."tbl_users"
    ADD CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("user_id")
ALTER TABLE ONLY "public"."tbl_users"
    ADD CONSTRAINT "tbl_users_user_id_key" UNIQUE ("user_id")
CREATE OR REPLACE TRIGGER "remove_user_store_id_trigger" AFTER DELETE ON "public"."tbl_stores" FOR EACH ROW EXECUTE FUNCTION "public"."remove_user_store_id"()
CREATE OR REPLACE TRIGGER "update_user_store_ids_trigger" AFTER INSERT ON "public"."tbl_stores" FOR EACH ROW EXECUTE FUNCTION "public"."update_user_store_ids"()
ALTER TABLE ONLY "public"."tbl_inventory"
    ADD CONSTRAINT "tbl_inventory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."tbl_products"("product_id") ON UPDATE CASCADE ON DELETE CASCADE
ALTER TABLE ONLY "public"."tbl_inventory"
    ADD CONSTRAINT "tbl_inventory_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."tbl_stores"("store_id") ON UPDATE CASCADE ON DELETE SET NULL
ALTER TABLE ONLY "public"."tbl_users"
    ADD CONSTRAINT "tbl_users_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."tbl_stores"("store_id") ON UPDATE CASCADE ON DELETE SET NULL
CREATE POLICY "ALL for authenticated" ON "public"."tbl_products" TO "authenticated" USING (true) WITH CHECK (true)
CREATE POLICY "ALL for authenticated" ON "public"."tbl_stores" TO "authenticated" USING (true) WITH CHECK (true)
CREATE POLICY "ALL for authenticated" ON "public"."tbl_users" USING (true) WITH CHECK (true)
CREATE POLICY "ALL for owner" ON "public"."tbl_inventory" USING (("store_id" IN ( SELECT "public"."get_user_store_ids"() AS "get_user_store_ids")))
CREATE POLICY "READ for all" ON "public"."tbl_stores" FOR SELECT USING (true)
CREATE POLICY "Read for all" ON "public"."tbl_products" FOR SELECT USING (true)
ALTER TABLE "public"."tbl_inventory" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."tbl_products" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."tbl_stores" ENABLE ROW LEVEL SECURITY
ALTER TABLE "public"."tbl_users" ENABLE ROW LEVEL SECURITY
ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres"
ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."tbl_products"
GRANT USAGE ON SCHEMA "public" TO "postgres"
GRANT USAGE ON SCHEMA "public" TO "anon"
GRANT USAGE ON SCHEMA "public" TO "authenticated"
GRANT USAGE ON SCHEMA "public" TO "service_role"
GRANT ALL ON FUNCTION "public"."get_inventory"("store_id_input" "uuid") TO "anon"
GRANT ALL ON FUNCTION "public"."get_inventory"("store_id_input" "uuid") TO "authenticated"
GRANT ALL ON FUNCTION "public"."get_inventory"("store_id_input" "uuid") TO "service_role"
GRANT ALL ON FUNCTION "public"."get_user_store_ids"() TO "anon"
GRANT ALL ON FUNCTION "public"."get_user_store_ids"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."get_user_store_ids"() TO "service_role"
GRANT ALL ON FUNCTION "public"."remove_user_store_id"() TO "anon"
GRANT ALL ON FUNCTION "public"."remove_user_store_id"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."remove_user_store_id"() TO "service_role"
GRANT ALL ON FUNCTION "public"."tigger_update_new_user"() TO "anon"
GRANT ALL ON FUNCTION "public"."tigger_update_new_user"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."tigger_update_new_user"() TO "service_role"
GRANT ALL ON FUNCTION "public"."update_user_store_ids"() TO "anon"
GRANT ALL ON FUNCTION "public"."update_user_store_ids"() TO "authenticated"
GRANT ALL ON FUNCTION "public"."update_user_store_ids"() TO "service_role"
GRANT ALL ON TABLE "public"."tbl_inventory" TO "anon"
GRANT ALL ON TABLE "public"."tbl_inventory" TO "authenticated"
GRANT ALL ON TABLE "public"."tbl_inventory" TO "service_role"
GRANT ALL ON TABLE "public"."tbl_products" TO "anon"
GRANT ALL ON TABLE "public"."tbl_products" TO "authenticated"
GRANT ALL ON TABLE "public"."tbl_products" TO "service_role"
GRANT ALL ON TABLE "public"."tbl_stores" TO "anon"
GRANT ALL ON TABLE "public"."tbl_stores" TO "authenticated"
GRANT ALL ON TABLE "public"."tbl_stores" TO "service_role"
GRANT ALL ON TABLE "public"."tbl_users" TO "anon"
GRANT ALL ON TABLE "public"."tbl_users" TO "authenticated"
GRANT ALL ON TABLE "public"."tbl_users" TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated"
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role"
RESET ALL