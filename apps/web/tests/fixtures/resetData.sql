DO $$
DECLARE
  t_name text;
  whitelist text[] := ARRAY['__diesel_schema_migrations'];
BEGIN
  FOR t_name IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND NOT (table_name = ANY(whitelist))
  LOOP
    EXECUTE 'TRUNCATE TABLE ' || quote_ident(t_name) || ' CASCADE';
  END LOOP;
END $$;
