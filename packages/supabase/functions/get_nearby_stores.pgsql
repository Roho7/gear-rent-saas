CREATE OR REPLACE FUNCTION _func_get_nearby_stores(lat numeric, lng numeric, radius numeric)
RETURNS uuid[] AS $$
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
$$ LANGUAGE plpgsql;