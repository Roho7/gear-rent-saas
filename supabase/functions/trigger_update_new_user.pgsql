CREATE OR REPLACE FUNCTION public.tigger_update_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.tbl_users (id, email, first_name, last_name, phone, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.phone,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now, let's create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.tigger_update_new_user();