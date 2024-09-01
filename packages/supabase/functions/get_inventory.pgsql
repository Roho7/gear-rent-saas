CREATE OR REPLACE FUNCTION get_inventory(store_id_input UUID)
RETURNS JSONB AS
$$
DECLARE
    return_data JSONB;
BEGIN
    SELECT 
        jsonb_build_object(
            'store_details', (
                SELECT jsonb_build_object(
                    'store_id', store_id,
                    'store_name', store_name,
                    'description', description,
                    'business_email', business_email,
                    'business_number', business_number,
                    'address', address
                )
                FROM tbl_stores
                WHERE store_id = store_id_input
            ),
            'inventory', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'inventory_id', inventory_id,
                        'product_id', product_id,
                        'quantity', quantity,
                        'price', price,
                        'available_units', available_units,
                        'total_units', total_units
                    )
                )
                FROM tbl_inventory
                WHERE store_id = store_id_input
            )
        ) INTO return_data;

    RETURN return_data;
END;
$$ LANGUAGE plpgsql;