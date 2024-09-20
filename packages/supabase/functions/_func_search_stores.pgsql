DROP FUNCTION IF EXISTS _func_get_nearby_stores;

CREATE OR REPLACE FUNCTION _func_search_stores(lat numeric, lng numeric, radius numeric)
RETURNS JSON AS $$
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
$$ LANGUAGE plpgsql;