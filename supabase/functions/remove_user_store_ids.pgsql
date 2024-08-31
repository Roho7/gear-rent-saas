
CREATE OR REPLACE FUNCTION remove_user_store_id()
RETURNS TRIGGER AS $$
DECLARE
  user_id_input UUID;
  current_store_ids UUID[];
  updated_store_ids UUID[];
BEGIN
  -- Get the user_id of the store owner
  SELECT user_id INTO user_id_input
  FROM tbl_stores
  WHERE store_id = OLD.store_id;

  -- Get current store_ids from auth.users
  SELECT COALESCE((raw_app_meta_data->>'store_ids')::jsonb, '[]')::UUID[]
  INTO current_store_ids
  FROM auth.users
  WHERE id = user_id_input;

  -- Remove the deleted store ID from the array
  SELECT ARRAY(SELECT unnest(current_store_ids) EXCEPT SELECT OLD.store_id)
  INTO updated_store_ids;

  -- Update raw_app_metadata with new store_ids array
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{store_ids}',
    to_jsonb(updated_store_ids)
  )
  WHERE id = user_id_input;

  -- Update tbl_users to remove the store_id if it matches the deleted store
  UPDATE tbl_users
  SET store_id = NULL
  WHERE user_id = user_id_input AND store_id = OLD.store_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on tbl_stores for deletion
CREATE TRIGGER remove_user_store_id_trigger
AFTER DELETE ON tbl_stores
FOR EACH ROW
EXECUTE FUNCTION remove_user_store_id();

