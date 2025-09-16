
-- Link all Pocky Choco Sticks to the 'Buy 2 Get 3 Special' promotion category
-- This will add all items in category 619b9828-acf0-48a9-bffc-7a319b91b1d6 to 'Buy 2 Get 3 Special' (a7c281f7-78b6-4f37-b6b8-8a7cb24a3cac)

INSERT INTO public.product_categories (product_id, category_id)
SELECT id, 'a7c281f7-78b6-4f37-b6b8-8a7cb24a3cac'
FROM public.products
WHERE category_id = '619b9828-acf0-48a9-bffc-7a319b91b1d6'
  AND id NOT IN (
    SELECT product_id FROM public.product_categories WHERE category_id = 'a7c281f7-78b6-4f37-b6b8-8a7cb24a3cac'
  );

-- The update_product_promotion() trigger on product_categories
-- will set promotion = 'bundle' for these products automatically.
