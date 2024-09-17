CREATE OR REPLACE FUNCTION _func_get_user_store_ids()
RETURNS SETOF UUID AS $$
DECLARE
  store_ids JSONB;
BEGIN
  SELECT COALESCE(raw_app_meta_data->'store_ids', '[]'::jsonb)
  INTO store_ids
  FROM auth.users
  WHERE id = auth.uid();

  RETURN QUERY 
  SELECT (jsonb_array_elements_text(store_ids))::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;