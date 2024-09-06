drop trigger if exists "update_user_store_ids_trigger" on "public"."tbl_stores";

alter table "public"."tbl_users" add column "email_confirmed" boolean;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_user_confirmation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update tbl_users when email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.tbl_users
    SET email_confirmed = TRUE
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER update_user_store_ids_trigger AFTER INSERT ON public.tbl_stores FOR EACH ROW EXECUTE FUNCTION update_user_store_ids();
ALTER TABLE "public"."tbl_stores" ENABLE ALWAYS TRIGGER "update_user_store_ids_trigger";


