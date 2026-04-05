CREATE SCHEMA IF NOT EXISTS data_tx;

INSERT INTO public.schema_migration_log (schema_name, migration_name, checksum)
VALUES ('data_tx', '001_create_schema', 'data-tx-schema-v1')
ON CONFLICT (schema_name, migration_name) DO NOTHING;
