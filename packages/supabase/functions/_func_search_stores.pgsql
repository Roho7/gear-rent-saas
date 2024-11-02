DROP FUNCTION IF EXISTS _func_search_stores;

CREATE OR REPLACE FUNCTION _func_search_stores(lat numeric, lng numeric, radius numeric)
RETURNS JSON AS $$
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
$$ LANGUAGE plpgsql;