CREATE SCHEMA IF NOT EXISTS master_data;

INSERT INTO public.schema_migration_log (schema_name, migration_name, checksum)
VALUES ('master_data', '001_create_schema', 'master-data-schema-v1')
ON CONFLICT (schema_name, migration_name) DO NOTHING;
