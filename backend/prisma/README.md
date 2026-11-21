# Prisma Database Guide

## Common Commands

### Client & Schema
```bash
npx prisma generate       # Generate Prisma Client
npx prisma validate       # Validate schema
npx prisma format         # Format schema
```

### Migrations
```bash
npx prisma migrate dev --name <migration_name>  # Create and apply migration
npx prisma migrate deploy                       # Apply existing migrations
npx prisma migrate status                       # Check migration status
npx prisma migrate reset                        # Reset database (destructive)
```

### Database Tools
```bash
npx prisma studio       # Open database GUI
npx prisma db seed      # Run seed script
npx prisma db pull      # Introspect existing database
npx prisma db push      # Push schema without migrations
```

## Database Environments

### Development
Uses `DATABASE_URL` from the backend `.env` file.

```bash
npx prisma migrate dev --name <migration_name>
```

### Integration Testing
Uses `TEST_DATABASE_URL` pointing to `taskmanagerdb_test`.

Apply existing migrations to the test database:

```bash
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5433/taskmanagerdb_test" npx prisma migrate deploy
```

### Important Notes

- Use `migrate dev` when developing and creating migrations.
- Use `migrate deploy` when applying existing migrations to test or production databases.
- `migrate dev` automatically generates Prisma Client.
- `migrate reset` is destructive and should never be run against production.
- Avoid `db push` when using migration-based database management.