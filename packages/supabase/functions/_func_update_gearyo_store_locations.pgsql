CREATE OR REPLACE FUNCTION _func_update_gearyo_store_locations(store_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE tbl_gearyo_stores
  SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  WHERE longitude IS NOT NULL AND latitude IS NOT NULL
  AND store_id = store_id;
END;
$$ LANGUAGE plpgsql;