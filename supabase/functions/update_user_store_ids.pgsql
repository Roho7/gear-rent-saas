-- Function to update raw_app_metadata with new store ID
CREATE OR REPLACE FUNCTION update_user_store_ids()
RETURNS TRIGGER AS $$
DECLARE
  user_id UUID;
  current_store_ids UUID[];
  updated_store_ids UUID[];
BEGIN
  -- Assume that NEW.owner_id contains the user ID of the store owner
  user_id := NEW.owner_id;
  
  -- Retrieve current store_ids array
  SELECT COALESCE((raw_app_metadata->>'store_ids')::jsonb, '[]')::UUID[]
  INTO current_store_ids
  FROM auth.users
  WHERE id = user_id;

  -- Add new store ID to the array
  updated_store_ids := array_append(current_store_ids, NEW.store_id);

  -- Update raw_app_metadata with new store_ids array
  UPDATE auth.users
  SET raw_app_metadata = jsonb_set(
    COALESCE(raw_app_metadata, '{}'::jsonb),
    '{store_ids}',
    to_jsonb(updated_store_ids)
  )
  WHERE id = user_id;

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