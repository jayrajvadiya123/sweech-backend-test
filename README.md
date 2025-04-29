# NestJS Backend API

## Tech Stack

- TypeScript
- NestJS
- Prisma ORM
- PostgreSQL
- Docker Compose

## Features

1. User Signup and Login with JWT
2. Bearer Token Authentication
3. User Update (username, password)
4. Post Creation, Listing, Detail View
5. Comment Creation, Listing (cursor-based), Deletion
6. Login History Tracking (time and IP)
7. Weekly Login Rankings

## Installation

```bash
git clone <your-repo-url>
cd sweech-backend-test
npm install
npx prisma generate
```

## Running the Application

```bash
docker-compose up -d --build
```

NestJS API: http://localhost:3001  
PostgreSQL: localhost:5432

## Database Migrations

```bash
npx prisma migrate dev --name init
```

## Authentication

JWT secret is configured in `.env` (`JWT_SECRET`).  
Token is valid for 20 minutes.  
Use `Authorization: Bearer <token>` in headers.

## Swagger API Documentation

- http://localhost:3001/api/docs

## Folder Structure

```
src/
├── auth/
├── common/
├── users/
├── posts/
├── comments/
├── login-history/
├── prisma/
├── main.ts
└── app.module.ts
```

## Linting

```bash
npm run lint
```

## Formatting

```bash
npm run format
```