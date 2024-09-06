CREATE OR REPLACE FUNCTION public.update_user_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tbl_users when email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.tbl_users
    SET email_confirmed = TRUE
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_email_confirmed
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.update_user_confirmation();

-- Add email_confirmed column to tbl_users if it doesn't exist
-- ALTER TABLE public.tbl_users
-- ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT FALSE;