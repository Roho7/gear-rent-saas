drop function if exists "public"."get_inventory"(store_id_input uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_business(store_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
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
END;
$function$
;


