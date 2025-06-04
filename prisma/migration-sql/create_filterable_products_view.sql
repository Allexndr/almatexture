-- Создание представления для фильтрации продуктов по свойствам
CREATE OR REPLACE VIEW public.filterable_products_view AS
SELECT 
  p.id,
  p.name,
  p.type,
  p.price,
  p.discount_price,
  p.is_available,
  d.name AS district_name,
  t.title AS texture_name,
  array_agg(DISTINCT pv.color) FILTER (WHERE pv.color IS NOT NULL) AS available_colors,
  array_agg(DISTINCT pv.size) FILTER (WHERE pv.size IS NOT NULL) AS available_sizes,
  array_agg(DISTINCT tag.name) FILTER (WHERE tag.name IS NOT NULL) AS tags
FROM 
  public.products p
LEFT JOIN 
  public.textures t ON p.texture_id = t.id
LEFT JOIN 
  public.districts d ON t.district_id = d.id
LEFT JOIN 
  public.product_variants pv ON p.id = pv.product_id
LEFT JOIN 
  public.texture_tags tt ON t.id = tt.texture_id
LEFT JOIN 
  public.tags tag ON tt.tag_id = tag.id
GROUP BY 
  p.id, t.title, d.name; 