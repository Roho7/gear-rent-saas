create type "public"."booking_status" as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table "public"."tbl_bookings" (
    "booking_id" uuid not null default uuid_generate_v4(),
    "inventory_id" uuid not null,
    "store_id" uuid not null,
    "user_id" uuid not null,
    "status" booking_status not null default 'pending'::booking_status,
    "booking_date" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "start_date" timestamp with time zone not null,
    "end_date" timestamp with time zone not null,
    "total_price" numeric(10,2) not null,
    "currency_code" text not null
);


alter table "public"."tbl_bookings" enable row level security;

CREATE INDEX idx_bookings_end_date ON public.tbl_bookings USING btree (end_date);

CREATE INDEX idx_bookings_inventory_id ON public.tbl_bookings USING btree (inventory_id);

CREATE INDEX idx_bookings_start_date ON public.tbl_bookings USING btree (start_date);

CREATE INDEX idx_bookings_status ON public.tbl_bookings USING btree (status);

CREATE INDEX idx_bookings_store_id ON public.tbl_bookings USING btree (store_id);

CREATE INDEX idx_bookings_user_id ON public.tbl_bookings USING btree (user_id);

CREATE UNIQUE INDEX tbl_bookings_pkey ON public.tbl_bookings USING btree (booking_id);

alter table "public"."tbl_bookings" add constraint "tbl_bookings_pkey" PRIMARY KEY using index "tbl_bookings_pkey";

alter table "public"."tbl_bookings" add constraint "check_date_order" CHECK ((end_date > start_date)) not valid;

alter table "public"."tbl_bookings" validate constraint "check_date_order";

alter table "public"."tbl_bookings" add constraint "check_positive_price" CHECK ((total_price >= (0)::numeric)) not valid;

alter table "public"."tbl_bookings" validate constraint "check_positive_price";

alter table "public"."tbl_bookings" add constraint "tbl_bookings_inventory_id_fkey" FOREIGN KEY (inventory_id) REFERENCES tbl_inventory(inventory_id) not valid;

alter table "public"."tbl_bookings" validate constraint "tbl_bookings_inventory_id_fkey";

alter table "public"."tbl_bookings" add constraint "tbl_bookings_store_id_fkey" FOREIGN KEY (store_id) REFERENCES tbl_stores(store_id) not valid;

alter table "public"."tbl_bookings" validate constraint "tbl_bookings_store_id_fkey";

alter table "public"."tbl_bookings" add constraint "tbl_bookings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES tbl_users(user_id) not valid;

alter table "public"."tbl_bookings" validate constraint "tbl_bookings_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_active_listings(sport text DEFAULT NULL::text, experience_input text DEFAULT NULL::text, rent_period_from timestamp without time zone DEFAULT NULL::timestamp without time zone, rent_period_to timestamp without time zone DEFAULT NULL::timestamp without time zone, latitude_input numeric DEFAULT NULL::numeric, longitude_input numeric DEFAULT NULL::numeric, radius numeric DEFAULT 100)
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
            i.store_id,
            ST_X(s.location::geometry) AS longitude,
            i.base_price::TEXT,
            p.product_id,
            i.currency_code
        FROM 
            tbl_products p
        LEFT JOIN 
            tbl_inventory i ON p.product_id = i.product_id
        LEFT JOIN 
            tbl_stores s ON i.store_id = s.store_id
        WHERE 
            (sport IS NULL OR p.category = sport)
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

grant delete on table "public"."tbl_bookings" to "anon";

grant insert on table "public"."tbl_bookings" to "anon";

grant references on table "public"."tbl_bookings" to "anon";

grant select on table "public"."tbl_bookings" to "anon";

grant trigger on table "public"."tbl_bookings" to "anon";

grant truncate on table "public"."tbl_bookings" to "anon";

grant update on table "public"."tbl_bookings" to "anon";

grant delete on table "public"."tbl_bookings" to "authenticated";

grant insert on table "public"."tbl_bookings" to "authenticated";

grant references on table "public"."tbl_bookings" to "authenticated";

grant select on table "public"."tbl_bookings" to "authenticated";

grant trigger on table "public"."tbl_bookings" to "authenticated";

grant truncate on table "public"."tbl_bookings" to "authenticated";

grant update on table "public"."tbl_bookings" to "authenticated";

grant delete on table "public"."tbl_bookings" to "service_role";

grant insert on table "public"."tbl_bookings" to "service_role";

grant references on table "public"."tbl_bookings" to "service_role";

grant select on table "public"."tbl_bookings" to "service_role";

grant trigger on table "public"."tbl_bookings" to "service_role";

grant truncate on table "public"."tbl_bookings" to "service_role";

grant update on table "public"."tbl_bookings" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."tbl_bookings"
as permissive
for all
to authenticated
using (true);



