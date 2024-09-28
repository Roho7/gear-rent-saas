create type "public"."enum_booking_status" as enum ('payment_pending', 'payment_failed', 'payment_successful', 'confirmed', 'fulfilled', 'cancelled');

alter table "public"."tbl_bookings" drop constraint "check_date_order";

alter table "public"."tbl_bookings" add column "booking_customer_details" jsonb;

alter table "public"."tbl_bookings" add column "booking_user_details" jsonb;

alter table "public"."tbl_bookings" add column "quantity" numeric;

alter table "public"."tbl_bookings" add column "stripe_invoice_id" text;

alter table "public"."tbl_bookings" alter column "status" drop default;

alter table "public"."tbl_bookings" alter column "status" set data type enum_booking_status using "status"::text::enum_booking_status;

drop type "public"."booking_status";

alter table "public"."tbl_bookings" add constraint "check_date_order" CHECK ((end_date >= start_date)) not valid;

alter table "public"."tbl_bookings" validate constraint "check_date_order";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._func_get_user_bookings()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$
DECLARE
    return_data JSONB;
BEGIN
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
    WHERE b.user_id = auth.uid();

    RETURN COALESCE(return_data, '[]'::JSONB);
END;
$function$
;


