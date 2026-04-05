DO $$
BEGIN
  CREATE TYPE master_data."Role" AS ENUM ('VIEWER', 'ANALYST', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE master_data."UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS master_data.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  name TEXT NOT NULL,
  role master_data."Role" NOT NULL DEFAULT 'VIEWER',
  status master_data."UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "refreshTokenHash" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_status_idx ON master_data.users (status);
CREATE INDEX IF NOT EXISTS users_role_idx ON master_data.users (role);

INSERT INTO public.schema_migration_log (schema_name, migration_name, checksum)
VALUES ('master_data', '002_create_enums_and_users', 'master-data-users-v1')
ON CONFLICT (schema_name, migration_name) DO NOTHING;
