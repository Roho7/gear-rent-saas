drop function if exists "public"."_func_get_nearby_stores"(lat numeric, lng numeric, radius numeric);

drop function if exists "public"."search_active_listings"(sport text, experience_input text, rent_period_from timestamp without time zone, rent_period_to timestamp without time zone, latitude_input numeric, longitude_input numeric, radius numeric);

alter table "public"."tbl_stores" add column "categories" text[];

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_search_active_listings(sport text DEFAULT NULL::text, store_id_input uuid DEFAULT NULL::uuid, experience_input text DEFAULT NULL::text, rent_period_from timestamp without time zone DEFAULT NULL::timestamp without time zone, rent_period_to timestamp without time zone DEFAULT NULL::timestamp without time zone, latitude_input numeric DEFAULT NULL::numeric, longitude_input numeric DEFAULT NULL::numeric, radius numeric DEFAULT 10)
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
            p.product_id,
            l.base_price::TEXT,
            l.currency_code,
            l.price_granularity,
            l.discount_1,
            l.discount_2,
            l.discount_3,
            l.description,
            l.product_metadata
        FROM 
            tbl_products p
        INNER JOIN 
            tbl_listings l ON p.product_id = l.product_id
        INNER JOIN 
            tbl_stores s ON l.store_id = s.store_id
        WHERE 
        (store_id_input IS NULL OR l.store_id = store_id_input) AND
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

CREATE OR REPLACE FUNCTION public._func_search_stores(lat numeric, lng numeric, radius numeric)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    result JSON;
BEGIN
  SELECT json_agg(store_results)
  INTO result
  FROM (
    SELECT 
      * 
      FROM tbl_stores s
      WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius)
  ) as store_results;

  RETURN result;


END;
$function$
;


