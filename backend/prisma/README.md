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
Uses `DATABASE_URL` from `backend/.env`.

```bash
npx prisma migrate dev --name <migration_name>
```

### Integration Testing
Uses `DATABASE_URL` from `backend/.env.test`, which points to `taskmanagerdb_test`.
Copy `.env.test.example` to `.env.test` and fill in your credentials.

Apply existing migrations to the test database:

```bash
npx dotenv run -f .env.test -- npx prisma migrate deploy
```

Reset the test database (destructive, test DB only):

```bash
npx dotenv run -f .env.test -- npx prisma migrate reset
```

`dotenv run -f <file> -- <command>` is the dotenv v18 CLI syntax. The older
`-e` flag from `dotenv-cli` does not work.

### Database Tools
```bash
npx prisma studio       # Open database GUI
npx prisma db pull      # Introspect existing database
```

### Important Notes
- Use `migrate dev` to create migrations, and `migrate deploy` to apply existing ones (test DB and CI).
- `migrate dev` automatically generates Prisma Client.
- Never run `migrate reset` against anything but the test database.
- Avoid `db push`, since this project uses migrations.