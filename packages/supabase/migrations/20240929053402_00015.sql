drop function if exists "public"."_func_get_user_bookings"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_get_bookings(store_id_input uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
    return_data JSONB;
    current_user_id UUID;
BEGIN
    -- Get the current user's ID
    current_user_id := auth.uid();

    SELECT
        jsonb_agg(
            jsonb_build_object(
                'booking_id', b.booking_id,
                'user_id', b.user_id,
                'listing_id', b.listing_id,
                'store_id', b.store_id,
                'total_price', b.total_price,
                'currency_code', b.currency_code,
                'quantity', b.quantity,
                'booking_date', b.booking_date,
                'start_date', b.start_date,
                'end_date', b.end_date,
                'status', b.status,
                'stripe_invoice_id', b.stripe_invoice_id,
                'booking_customer_details', b.booking_customer_details,
                'booking_user_details', b.booking_user_details,
                'product_group_id', l.product_group_id
            )
            ORDER BY b.booking_date DESC
        )
    INTO return_data
    FROM tbl_bookings b
    LEFT JOIN tbl_listings l ON b.listing_id = l.listing_id
    WHERE 
        CASE 
            WHEN store_id_input IS NOT NULL THEN b.store_id = store_id_input
            ELSE b.user_id = current_user_id
        END;

    RETURN COALESCE(return_data, '[]'::JSONB);
END;
$function$
;


