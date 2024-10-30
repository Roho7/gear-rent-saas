alter table "public"."tbl_users" add column "sports_metadata" jsonb;

alter table "public"."tbl_users" add column "user_metadata" jsonb;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_trigger_update_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.tbl_users (user_id, email, name, phone, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.phone,
    NEW.created_at
  );
  RETURN NEW;
END;
$function$
;


