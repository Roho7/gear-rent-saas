alter table "public"."tbl_listings" drop constraint "tbl_listings_product_id_fkey";

drop function if exists "public"."_func_search_active_listings"(sport text, store_id_input uuid, experience_input text, rent_period_from timestamp without time zone, rent_period_to timestamp without time zone, latitude_input numeric, longitude_input numeric, radius numeric);

create table "public"."tbl_product_groups" (
    "sport" character varying(50) not null,
    "product_group_name" text,
    "product_group_id" uuid not null default gen_random_uuid(),
    "sizes" text[],
    "image_url" text
);


alter table "public"."tbl_product_groups" enable row level security;

alter table "public"."tbl_listings" drop column "product_id";

alter table "public"."tbl_listings" add column "brands" text[];

alter table "public"."tbl_listings" add column "gender" enum_genders;

alter table "public"."tbl_listings" add column "product_group_id" uuid;

alter table "public"."tbl_listings" add column "size" text;

alter table "public"."tbl_listings" alter column "base_price" set data type numeric using "base_price"::numeric;

CREATE INDEX idx_product_groups_sport ON public.tbl_product_groups USING btree (sport);

CREATE UNIQUE INDEX tbl_product_groups_pkey ON public.tbl_product_groups USING btree (product_group_id);

CREATE UNIQUE INDEX tbl_product_groups_product_group_id_key ON public.tbl_product_groups USING btree (product_group_id);

alter table "public"."tbl_product_groups" add constraint "tbl_product_groups_pkey" PRIMARY KEY using index "tbl_product_groups_pkey";

alter table "public"."tbl_listings" add constraint "tbl_listings_product_group_id_fkey" FOREIGN KEY (product_group_id) REFERENCES tbl_product_groups(product_group_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tbl_listings" validate constraint "tbl_listings_product_group_id_fkey";

alter table "public"."tbl_product_groups" add constraint "tbl_product_groups_product_group_id_key" UNIQUE using index "tbl_product_groups_product_group_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_search_active_listings(sport_input text DEFAULT NULL::text, store_id_input uuid DEFAULT NULL::uuid, experience_input text DEFAULT NULL::text, rent_period_from timestamp without time zone DEFAULT NULL::timestamp without time zone, rent_period_to timestamp without time zone DEFAULT NULL::timestamp without time zone, latitude_input numeric DEFAULT NULL::numeric, longitude_input numeric DEFAULT NULL::numeric, radius numeric DEFAULT 10)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(listing_data)
    INTO result
    FROM (
        SELECT 
            CASE 
                WHEN latitude_input IS NOT NULL AND longitude_input IS NOT NULL THEN 
                    ST_Distance(s.location, ST_SetSRID(ST_MakePoint(longitude_input, latitude_input), 4326)::geography)
                ELSE NULL
            END AS distance,
            ST_Y(s.location::geometry) AS latitude,
            l.store_id,
            l.listing_id,
            ST_X(s.location::geometry) AS longitude,
            p.product_group_id,
            l.base_price::TEXT,
            l.currency_code,
            l.price_granularity,
            l.discount_1,
            l.discount_2,
            l.discount_3,
            l.description,
            l.product_metadata
        FROM 
            tbl_product_groups p
        INNER JOIN 
            tbl_listings l ON p.product_group_id = l.product_group_id
        INNER JOIN 
            tbl_stores s ON l.store_id = s.store_id
        WHERE 
        (store_id_input IS NULL OR l.store_id = store_id_input) AND
            (sport_input IS NULL OR p.sport = sport_input)
            AND (experience_input IS NULL OR experience_input = ANY(p.experience))
            AND (
                latitude_input IS NULL 
                OR longitude_input IS NULL 
                OR ST_DWithin(
                    s.location, 
                    ST_SetSRID(ST_MakePoint(longitude_input, latitude_input), 4326)::geography, 
                    radius * 1000  -- Convert km to meters
                )
            )
        ORDER BY 
            CASE 
                WHEN latitude_input IS NOT NULL AND longitude_input IS NOT NULL THEN
                    ST_Distance(s.location, ST_SetSRID(ST_MakePoint(longitude_input, latitude_input), 4326)::geography)
                ELSE 0
            END
    ) AS listing_data;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public._func_get_business(store_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
    return_data JSONB;
    current_user_email TEXT;
    current_user_role TEXT;
BEGIN
    -- Get the current user's email and role
    SELECT auth.email() INTO current_user_email;
    SELECT auth.role() INTO current_user_role;

    SELECT 
        jsonb_build_object(
            'user', (
                SELECT row_to_json(u.*)
                FROM tbl_users u
                WHERE (store_id_input IS NULL OR u.store_id = store_id_input)
                  AND (u.email = current_user_email OR current_user_role = 'service_role')
                  LIMIT 1
            ),
            'store', (
                SELECT row_to_json(s.*)
                FROM tbl_stores s
                WHERE (store_id_input IS NULL OR s.store_id = store_id_input)
                  AND EXISTS (
                      SELECT 1 FROM tbl_users u
                      WHERE u.store_id = s.store_id
                        AND (u.email = current_user_email OR current_user_role = 'service_role')
                  )
                  LIMIT 1

            ),
            'inventory', (
                SELECT json_agg(row_to_json(i.*))
                FROM tbl_listings i
                WHERE (store_id_input IS NULL OR i.store_id = store_id_input)
                  AND EXISTS (
                      SELECT 1 FROM tbl_users u
                      WHERE u.store_id = i.store_id
                        AND (u.email = current_user_email OR current_user_role = 'service_role')
                  )
            )
        ) INTO return_data;

    RETURN return_data;
END;
$function$
;

grant delete on table "public"."tbl_product_groups" to "anon";

grant insert on table "public"."tbl_product_groups" to "anon";

grant references on table "public"."tbl_product_groups" to "anon";

grant select on table "public"."tbl_product_groups" to "anon";

grant trigger on table "public"."tbl_product_groups" to "anon";

grant truncate on table "public"."tbl_product_groups" to "anon";

grant update on table "public"."tbl_product_groups" to "anon";

grant delete on table "public"."tbl_product_groups" to "authenticated";

grant insert on table "public"."tbl_product_groups" to "authenticated";

grant references on table "public"."tbl_product_groups" to "authenticated";

grant select on table "public"."tbl_product_groups" to "authenticated";

grant trigger on table "public"."tbl_product_groups" to "authenticated";

grant truncate on table "public"."tbl_product_groups" to "authenticated";

grant update on table "public"."tbl_product_groups" to "authenticated";

grant delete on table "public"."tbl_product_groups" to "service_role";

grant insert on table "public"."tbl_product_groups" to "service_role";

grant references on table "public"."tbl_product_groups" to "service_role";

grant select on table "public"."tbl_product_groups" to "service_role";

grant trigger on table "public"."tbl_product_groups" to "service_role";

grant truncate on table "public"."tbl_product_groups" to "service_role";

grant update on table "public"."tbl_product_groups" to "service_role";

create policy "ALL for admin"
on "public"."tbl_product_groups"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM tbl_users
  WHERE ((tbl_users.user_id = auth.uid()) AND (tbl_users.is_admin = true)))));


create policy "READ for all"
on "public"."tbl_product_groups"
as permissive
for select
to public
using (true);



