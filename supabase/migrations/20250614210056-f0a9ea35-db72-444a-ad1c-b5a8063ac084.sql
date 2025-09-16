
-- Add product 30279a06-e2e3-42d8-9ede-2eb918c5ef8e to Free Delivery Offers if it is not there already
INSERT INTO product_categories (product_id, category_id)
SELECT 
  '30279a06-e2e3-42d8-9ede-2eb918c5ef8e',
  (SELECT id FROM categories WHERE name ILIKE 'Free Delivery Offers')
WHERE NOT EXISTS (
  SELECT 1 FROM product_categories WHERE 
    product_id = '30279a06-e2e3-42d8-9ede-2eb918c5ef8e' AND
    category_id = (SELECT id FROM categories WHERE name ILIKE 'Free Delivery Offers')
);
