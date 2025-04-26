-- Добавление индекса для оптимизации поиска пользователей по email
CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User" ("email");

-- Добавление индекса для оптимизации запросов по роли пользователя
CREATE INDEX IF NOT EXISTS "idx_user_role" ON "User" ("role");

-- Добавление индекса для оптимизации поиска текстур по району
CREATE INDEX IF NOT EXISTS "idx_texture_district_id" ON "Texture" ("districtId");

-- Добавление составного индекса для поиска текстур по признаку "избранное"
CREATE INDEX IF NOT EXISTS "idx_texture_featured" ON "Texture" ("isFeatured") 
WHERE "isFeatured" = true;

-- Добавление индекса для оптимизации поиска по тегам
CREATE INDEX IF NOT EXISTS "idx_texture_tag_texture_id" ON "TextureTag" ("textureId");

-- Добавление индекса для сортировки по популярности (кол-во просмотров)
CREATE INDEX IF NOT EXISTS "idx_texture_views_count" ON "Texture" ("viewsCount" DESC NULLS LAST);

-- Добавление индекса для поиска в полнотекстовом режиме (если PostgreSQL)
-- Это работает только в PostgreSQL. Для других СУБД могут потребоваться другие индексы
-- Для SQLite, например, это не будет работать и нужно закомментировать
CREATE INDEX IF NOT EXISTS "idx_texture_title_description" ON "Texture" USING GIN (to_tsvector('english', "title" || ' ' || COALESCE("description", '')));

-- Добавление индекса для поиска по slug районов
CREATE INDEX IF NOT EXISTS "idx_district_slug" ON "District" ("slug");

-- Добавление индекса для поиска по slug тегов
CREATE INDEX IF NOT EXISTS "idx_tag_slug" ON "Tag" ("slug"); 