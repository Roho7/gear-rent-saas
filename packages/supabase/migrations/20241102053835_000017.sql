create table "public"."tbl_gearyo_stores" (
    "store_id" uuid not null default gen_random_uuid(),
    "store_name" text not null,
    "google_rating" numeric,
    "description" text,
    "address_line1" text,
    "closing_time" text,
    "business_number" text,
    "store_img" text,
    "business_email" text,
    "user_id" uuid not null,
    "address_line2" text,
    "country" text,
    "postcode" text,
    "city" text,
    "google_place_id" text,
    "latitude" numeric,
    "location" geography,
    "longitude" numeric,
    "categories" text[]
);


alter table "public"."tbl_gearyo_stores" enable row level security;

CREATE UNIQUE INDEX tbl_gearyo_stores_pkey ON public.tbl_gearyo_stores USING btree (store_id, user_id);

CREATE UNIQUE INDEX tbl_gearyo_stores_store_id_key ON public.tbl_gearyo_stores USING btree (store_id);

alter table "public"."tbl_gearyo_stores" add constraint "tbl_gearyo_stores_pkey" PRIMARY KEY using index "tbl_gearyo_stores_pkey";

alter table "public"."tbl_gearyo_stores" add constraint "tbl_gearyo_stores_store_id_key" UNIQUE using index "tbl_gearyo_stores_store_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM tbl_users 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  );
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_update_gearyo_store_locations(store_id_input uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE tbl_gearyo_stores
  SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  WHERE longitude IS NOT NULL AND latitude IS NOT NULL
  AND store_id = store_id_input;
END;
$function$
;

CREATE OR REPLACE FUNCTION public._func_update_store_locations(store_id_input uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE tbl_stores
  SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  WHERE longitude IS NOT NULL AND latitude IS NOT NULL
  AND store_id = store_id_input;
END;
$function$
;

CREATE OR REPLACE FUNCTION public._func_search_stores(lat numeric, lng numeric, radius numeric)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    result JSON;
BEGIN
  WITH stores_with_location AS (
    SELECT s.*, 'store' as store_type
    FROM tbl_stores s 
    WHERE s.location IS NOT NULL
    AND ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius)
  ),
  gearyo_stores_with_location AS (
    SELECT gs.*, 'gearyo_store' as store_type
    FROM tbl_gearyo_stores gs
    WHERE gs.location IS NOT NULL 
    AND ST_DWithin(gs.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius)
  ),
  combined_results AS (
    SELECT * FROM stores_with_location
    UNION ALL
    SELECT * FROM gearyo_stores_with_location
  )
  SELECT json_agg(combined_results.*)
  INTO result
  FROM combined_results;

  RETURN result;
END;
$function$
;

grant delete on table "public"."tbl_gearyo_stores" to "anon";

grant insert on table "public"."tbl_gearyo_stores" to "anon";

grant references on table "public"."tbl_gearyo_stores" to "anon";

grant select on table "public"."tbl_gearyo_stores" to "anon";

grant trigger on table "public"."tbl_gearyo_stores" to "anon";

grant truncate on table "public"."tbl_gearyo_stores" to "anon";

grant update on table "public"."tbl_gearyo_stores" to "anon";

grant delete on table "public"."tbl_gearyo_stores" to "authenticated";

grant insert on table "public"."tbl_gearyo_stores" to "authenticated";

grant references on table "public"."tbl_gearyo_stores" to "authenticated";

grant select on table "public"."tbl_gearyo_stores" to "authenticated";

grant trigger on table "public"."tbl_gearyo_stores" to "authenticated";

grant truncate on table "public"."tbl_gearyo_stores" to "authenticated";

grant update on table "public"."tbl_gearyo_stores" to "authenticated";

grant delete on table "public"."tbl_gearyo_stores" to "service_role";

grant insert on table "public"."tbl_gearyo_stores" to "service_role";

grant references on table "public"."tbl_gearyo_stores" to "service_role";

grant select on table "public"."tbl_gearyo_stores" to "service_role";

grant trigger on table "public"."tbl_gearyo_stores" to "service_role";

grant truncate on table "public"."tbl_gearyo_stores" to "service_role";

grant update on table "public"."tbl_gearyo_stores" to "service_role";

create policy "ALL for admin"
on "public"."tbl_gearyo_stores"
as permissive
for all
to authenticated
using (_func_is_admin())
with check (_func_is_admin());


create policy "READ for ALL"
on "public"."tbl_gearyo_stores"
as permissive
for select
to authenticated
using (true);




