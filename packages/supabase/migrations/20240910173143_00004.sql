create extension if not exists "postgis" with schema "public" version '3.3.2';

alter table "public"."tbl_stores" add column "latitude" numeric;

alter table "public"."tbl_stores" add column "location" geography(Point,4326);

alter table "public"."tbl_stores" add column "longitude" numeric;

set check_function_bodies = off;

create type "public"."geometry_dump" as ("path" integer[], "geom" geometry);

CREATE OR REPLACE FUNCTION public.get_nearby_stores(lat numeric, lng numeric, radius numeric)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$
DECLARE
  store_ids uuid[];
BEGIN
  SELECT array_agg(s.store_id)
  INTO store_ids
  FROM tbl_stores s
  WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius)
  LIMIT 10;

  RETURN store_ids;
END;
$function$
;

create type "public"."valid_detail" as ("valid" boolean, "reason" character varying, "location" geometry);

grant delete on table "public"."spatial_ref_sys" to "anon";

grant insert on table "public"."spatial_ref_sys" to "anon";

grant references on table "public"."spatial_ref_sys" to "anon";

grant select on table "public"."spatial_ref_sys" to "anon";

grant trigger on table "public"."spatial_ref_sys" to "anon";

grant truncate on table "public"."spatial_ref_sys" to "anon";

grant update on table "public"."spatial_ref_sys" to "anon";

grant delete on table "public"."spatial_ref_sys" to "authenticated";

grant insert on table "public"."spatial_ref_sys" to "authenticated";

grant references on table "public"."spatial_ref_sys" to "authenticated";

grant select on table "public"."spatial_ref_sys" to "authenticated";

grant trigger on table "public"."spatial_ref_sys" to "authenticated";

grant truncate on table "public"."spatial_ref_sys" to "authenticated";

grant update on table "public"."spatial_ref_sys" to "authenticated";

grant delete on table "public"."spatial_ref_sys" to "postgres";

grant insert on table "public"."spatial_ref_sys" to "postgres";

grant references on table "public"."spatial_ref_sys" to "postgres";

grant select on table "public"."spatial_ref_sys" to "postgres";

grant trigger on table "public"."spatial_ref_sys" to "postgres";

grant truncate on table "public"."spatial_ref_sys" to "postgres";

grant update on table "public"."spatial_ref_sys" to "postgres";

grant delete on table "public"."spatial_ref_sys" to "service_role";

grant insert on table "public"."spatial_ref_sys" to "service_role";

grant references on table "public"."spatial_ref_sys" to "service_role";

grant select on table "public"."spatial_ref_sys" to "service_role";

grant trigger on table "public"."spatial_ref_sys" to "service_role";

grant truncate on table "public"."spatial_ref_sys" to "service_role";

grant update on table "public"."spatial_ref_sys" to "service_role";


