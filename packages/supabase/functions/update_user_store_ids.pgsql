-- Function to update raw_app_metadata with new store ID
CREATE OR REPLACE FUNCTION update_user_store_ids()
RETURNS TRIGGER AS $$
DECLARE
  user_id_input UUID;
  current_store_ids JSONB;
  updated_store_ids JSONB;
BEGIN
  -- Assume that NEW.user_id contains the user ID of the store owner
  user_id_input := NEW.user_id;

  -- Get current store_ids as JSONB
  SELECT COALESCE(raw_app_meta_data->'store_ids', '[]'::jsonb)
  INTO current_store_ids
  FROM auth.users
  WHERE id = user_id_input;

  -- Add new store ID to the JSONB array
  updated_store_ids := current_store_ids || to_jsonb(NEW.store_id);

  -- Update raw_app_metadata with new store_ids array
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{store_ids}',
    updated_store_ids
  )
  WHERE id = user_id_input;

  -- Update tbl_users
  UPDATE tbl_users u
  SET store_id = NEW.store_id
  WHERE u.user_id = user_id_input;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on tbl_stores
CREATE TRIGGER update_user_store_ids_trigger
AFTER INSERT ON tbl_stores
FOR EACH ROW
EXECUTE FUNCTION update_user_store_ids();

-- Grant necessary permissions
GRANT ALL ON tbl_stores TO authenticated;
GRANT ALL ON auth.users TO authenticated;