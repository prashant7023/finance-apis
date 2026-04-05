CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.schema_migration_log (
  id BIGSERIAL PRIMARY KEY,
  schema_name TEXT NOT NULL,
  migration_name TEXT NOT NULL,
  checksum TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (schema_name, migration_name)
);

INSERT INTO public.schema_migration_log (schema_name, migration_name, checksum)
VALUES ('public', '001_bootstrap_public', 'public-bootstrap-v1')
ON CONFLICT (schema_name, migration_name) DO NOTHING;
