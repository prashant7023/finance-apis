# Database Architecture

This project separates database objects into three PostgreSQL schemas:

- public: shared objects, extensions, migration log
- master_data: identity and reference data (users, roles, statuses)
- data_tx: transactional financial records

## Folder Layout

```
database/
├── public/
│   └── migrations/
├── master_data/
│   └── migrations/
└── data_tx/
    └── migrations/
```

## Migration Order

Run SQL migrations in this order:

1. `database/public/migrations/001_bootstrap_public.sql`
2. `database/master_data/migrations/001_create_schema.sql`
3. `database/master_data/migrations/002_create_enums_and_users.sql`
4. `database/data_tx/migrations/001_create_schema.sql`
5. `database/data_tx/migrations/002_create_enums_and_transactions.sql`

## Notes

- Prisma remains the primary ORM migration source.
- These SQL files mirror the same schema split and are useful for DBA review or controlled SQL execution.
- Migration executions are tracked in `public.schema_migration_log`.
- For managed Postgres providers, use `npm run prisma:push` to apply schema, then keep SQL artifacts via `npm run prisma:migrate:sql`.
