
-- Get product IDs (for the user to verify before running changes)
SELECT id, name FROM products WHERE name ILIKE '%Premium Jasmine Rice 10kg%' OR name ILIKE '%Ozeki Josen Karatamba Namachozo Sake 15.5% ALC VOL%';

-- Get category ID for 'Free Delivery Offers'
SELECT id, name FROM categories WHERE name ILIKE 'Free Delivery Offers';

-- REMOVE Premium Jasmine Rice 10kg from Free Delivery Offers
DELETE FROM product_categories
WHERE product_id = (SELECT id FROM products WHERE name ILIKE '%Premium Jasmine Rice 10kg%')
  AND category_id = (SELECT id FROM categories WHERE name ILIKE 'Free Delivery Offers');

-- ADD Ozeki Josen Karatamba Namachozo Sake 15.5% ALC VOL to Free Delivery Offers
INSERT INTO product_categories (product_id, category_id)
SELECT 
  (SELECT id FROM products WHERE name ILIKE '%Ozeki Josen Karatamba Namachozo Sake 15.5% ALC VOL%'),
  (SELECT id FROM categories WHERE name ILIKE 'Free Delivery Offers')
WHERE NOT EXISTS (
  SELECT 1 FROM product_categories WHERE 
    product_id = (SELECT id FROM products WHERE name ILIKE '%Ozeki Josen Karatamba Namachozo Sake 15.5% ALC VOL%') AND
    category_id = (SELECT id FROM categories WHERE name ILIKE 'Free Delivery Offers')
);
