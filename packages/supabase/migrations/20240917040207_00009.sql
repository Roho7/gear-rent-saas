drop trigger if exists "remove_user_store_id_trigger" on "public"."tbl_stores";

drop trigger if exists "update_user_store_ids_trigger" on "public"."tbl_stores";

drop policy "ALL for owner" on "public"."tbl_listings";

drop function if exists "public"."get_business"(store_id_input uuid);

drop function if exists "public"."get_nearby_stores"(lat numeric, lng numeric, radius numeric);

drop function if exists "public"."get_user_store_ids"();

drop function if exists "public"."remove_user_store_id"();

drop function if exists "public"."tigger_update_new_user"();

drop function if exists "public"."update_user_confirmation"();

drop function if exists "public"."update_user_store_ids"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_get_business(store_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$DECLARE
    return_data JSONB;
    current_user_email TEXT;
    current_user_role TEXT;
BEGIN
    -- Get the current user's email and role
    SELECT auth.email() INTO current_user_email;
    SELECT auth.role() INTO current_user_role;

    SELECT 
        jsonb_build_object(
            'user', (
                SELECT row_to_json(u.*)
                FROM tbl_users u
                WHERE (store_id_input IS NULL OR u.store_id = store_id_input)
                  AND (u.email = current_user_email OR current_user_role = 'service_role')
                  LIMIT 1
            ),
            'store', (
                SELECT row_to_json(s.*)
                FROM tbl_stores s
                WHERE (store_id_input IS NULL OR s.store_id = store_id_input)
                  AND EXISTS (
                      SELECT 1 FROM tbl_users u
                      WHERE u.store_id = s.store_id
                        AND (u.email = current_user_email OR current_user_role = 'service_role')
                  )
                  LIMIT 1

            ),
            'inventory', (
                SELECT json_agg(row_to_json(i.*))
                FROM tbl_listings i
                WHERE (store_id_input IS NULL OR i.store_id = store_id_input)
                  AND EXISTS (
                      SELECT 1 FROM tbl_users u
                      WHERE u.store_id = i.store_id
                        AND (u.email = current_user_email OR current_user_role = 'service_role')
                  )
            )
        ) INTO return_data;

    RETURN return_data;
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_get_nearby_stores(lat numeric, lng numeric, radius numeric)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$DECLARE
  store_ids uuid[];
BEGIN
  SELECT array_agg(s.store_id)
  INTO store_ids
  FROM tbl_stores s
  WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius)
  LIMIT 10;

  RETURN store_ids;
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_get_user_store_ids()
 RETURNS SETOF uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  store_ids JSONB;
BEGIN
  SELECT COALESCE(raw_app_meta_data->'store_ids', '[]'::jsonb)
  INTO store_ids
  FROM auth.users
  WHERE id = auth.uid();

  RETURN QUERY 
  SELECT (jsonb_array_elements_text(store_ids))::UUID;
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_trigger_remove_user_store_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  user_id_input UUID;
  current_store_ids UUID[];
  updated_store_ids UUID[];
BEGIN
  -- Get the user_id of the store owner
  SELECT user_id INTO user_id_input
  FROM tbl_stores
  WHERE store_id = OLD.store_id;

  -- Update tbl_users to remove the store_id if it matches the deleted store
  UPDATE tbl_users
  SET store_id = NULL
  WHERE user_id = user_id_input AND store_id = OLD.store_id;

  RETURN OLD;
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_trigger_update_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.tbl_users (user_id, email, name, phone, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.phone,
    NEW.created_at
  );
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public._func_trigger_update_user_store_ids()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
  user_id_input UUID;
  current_store_ids JSONB;
  updated_store_ids JSONB;
BEGIN
  -- Assume that NEW.user_id contains the user ID of the store owner
  user_id_input := NEW.user_id;

  -- Update tbl_users
  UPDATE tbl_users u
  SET store_id = NEW.store_id
  WHERE u.user_id = user_id_input;

  RETURN NEW;
END;$function$
;

create policy "ALL for owner"
on "public"."tbl_listings"
as permissive
for all
to public
using ((store_id IN ( SELECT tbl_stores.store_id
   FROM tbl_stores
  WHERE (tbl_stores.user_id = auth.uid()))));


CREATE TRIGGER remove_user_store_id_trigger AFTER DELETE ON public.tbl_stores FOR EACH ROW EXECUTE FUNCTION _func_trigger_remove_user_store_id();

CREATE TRIGGER update_user_store_ids_trigger AFTER INSERT ON public.tbl_stores FOR EACH ROW EXECUTE FUNCTION _func_trigger_update_user_store_ids();
ALTER TABLE "public"."tbl_stores" ENABLE ALWAYS TRIGGER "update_user_store_ids_trigger";


