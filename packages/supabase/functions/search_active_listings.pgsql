DROP FUNCTION IF EXISTS search_active_listings;
CREATE OR REPLACE FUNCTION search_active_listings(
    sport TEXT DEFAULT NULL,
    experience_input TEXT DEFAULT NULL,
    rent_period_from TIMESTAMP DEFAULT NULL,
    rent_period_to TIMESTAMP DEFAULT NULL,
    latitude_input NUMERIC DEFAULT NULL,
    longitude_input NUMERIC DEFAULT NULL,
    radius NUMERIC DEFAULT 10
)
RETURNS JSON AS $$
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
        LEFT JOIN 
            tbl_listings l ON p.product_id = l.product_id
        LEFT JOIN 
            tbl_stores s ON l.store_id = s.store_id
        WHERE 
            l.listing_id IS NOT NULL AND
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
$$ LANGUAGE plpgsql;