-- Создание представления для объединения текстур и продуктов
CREATE OR REPLACE VIEW public.texture_products_view AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  p.description AS product_description,
  p.price,
  p.discount_price,
  p.type AS product_type,
  p.stock_quantity,
  p.is_available,
  t.id AS texture_id,
  t.title AS texture_title,
  t.description AS texture_description,
  t.image_url AS texture_image_url,
  t.is_featured AS texture_is_featured,
  d.id AS district_id,
  d.name AS district_name,
  d.slug AS district_slug,
  d.color AS district_color,
  string_agg(DISTINCT tag.name, ', ') AS texture_tags
FROM 
  public.products p
LEFT JOIN 
  public.textures t ON p.texture_id = t.id
LEFT JOIN 
  public.districts d ON t.district_id = d.id
LEFT JOIN 
  public.texture_tags tt ON t.id = tt.texture_id
LEFT JOIN 
  public.tags tag ON tt.tag_id = tag.id
GROUP BY 
  p.id, t.id, d.id; 