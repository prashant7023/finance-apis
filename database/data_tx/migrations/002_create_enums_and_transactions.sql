DO $$
BEGIN
  CREATE TYPE data_tx."TransactionType" AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS data_tx.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(15, 2) NOT NULL,
  type data_tx."TransactionType" NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
  "userId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT transactions_user_fk FOREIGN KEY ("userId")
    REFERENCES master_data.users (id)
    ON DELETE SET NULL,
  CONSTRAINT transactions_amount_positive_ck CHECK (amount >= 0.01)
);

CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON data_tx.transactions ("userId");
CREATE INDEX IF NOT EXISTS transactions_type_idx ON data_tx.transactions (type);
CREATE INDEX IF NOT EXISTS transactions_category_idx ON data_tx.transactions (category);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON data_tx.transactions (date);

INSERT INTO public.schema_migration_log (schema_name, migration_name, checksum)
VALUES ('data_tx', '002_create_enums_and_transactions', 'data-tx-transactions-v1')
ON CONFLICT (schema_name, migration_name) DO NOTHING;
