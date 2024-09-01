CREATE OR REPLACE VIEW view_stores_inventory AS
SELECT 
    s.store_id,
    s.store_name,
    s.address,
    s.business_number,
    s.business_email,
    s.description AS store_description,
    s.google_rating,
    i.product_id,
    p.product_title,
    p.description AS product_description,
    p.category,
    i.total_units,
    i.availabile_units
FROM 
    tbl_stores s
JOIN 
    tbl_inventory i ON s.store_id = i.store_id
JOIN
    tbl_products p ON i.product_id = p.product_id;

-- Grant necessary permissions
GRANT SELECT ON view_stores_inventory TO authenticated;