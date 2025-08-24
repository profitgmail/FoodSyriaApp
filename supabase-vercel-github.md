# FoodSyriaApp Credentials and Configuration

## Project Identifier

`k0bIEKibxfvzndGY`

## Project URL

`https://hoeayddzdrkyluxyoknu.supabase.co`

## API Keys

### Anon Public Key

```
[SUPABASE_ANON_KEY]
```

### Service Role Key

```
[SUPABASE_SERVICE_ROLE_KEY]
```

### Legacy JWT Secret

`Tld7vDrNkYYjOzP8sy3dStnDXkgBxeH01Txwr5xukVs4Zsvai4biIYrufr0+HERBZ2ZPuzfPEaViMqSnuXk2BA==`

## Database Connection Strings

### Direct Connection

`postgresql://postgres:[YOUR-PASSWORD]@db.hoeayddzdrkyluxyoknu.supabase.co:5432/postgres`

### Transaction Pooler

`postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Session Pooler

`postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`

## `db.js` Example

```javascript
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export default sql
```

### Example `DATABASE_URL` assignments

`DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.hoeayddzdrkyluxyoknu.supabase.co:5432/postgres`

`DATABASE_URL=postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

`DATABASE_URL=postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`

## Vercel Token

`Wx3QIeg1wkbIO9A2WIYAcA55`

## PSQL Command

`psql -h db.hoeayddzdrkyluxyoknu.supabase.co -p 5432 -d postgres -U postgres`

## Supabase Configuration Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## `.env.local` Example

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Supabase Client Setup

### Installation

```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
```

### `lib/supabase.ts` Example

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## User Credentials

* **User:** admin
* **Email:** profit1993house@gmail.com
* **Password:** `k0bIEKibxfvzndGY`

## GitHub Personal Access Token

`[GITHUB_TOKEN]`

## Storage Settings

### S3 Endpoint

`https://hoeayddzdrkyluxyoknu.storage.supabase.co/storage/v1/s3`

### Region

`ap-southeast-1`

## Project Connection Environment Variables

* `POSTGRES_URL`
* `POSTGRES_PRISMA_URL`
* `POSTGRES_URL_NON_POOLING`
* `POSTGRES_USER`
* `POSTGRES_HOST`
* `POSTGRES_PASSWORD`
* `POSTGRES_DATABASE`
* `SUPABASE_ANON_KEY`
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* `SUPABASE_JWT_SECRET`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `NEXT_PUBLIC_SUPABASE_URL`

## `.env.local` for Supabase

```
NEXT_PUBLIC_SUPABASE_URL=https://hoeayddzdrkyluxyoknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]
```

## `prisma/schema.prisma` Example

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## `.env.local` for Prisma

```
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres.hoeayddzdrkyluxyoknu:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

## Log Entry Example

* **ID:** `4a37d361-8207-4463-999c-2e931306fa6f`
* **Timestamp:** `21 Aug 17:15:58`
* **Event Message:**

```json
{
  "auth_event": {
    "action": "user_signedup",
    "actor_id": "00000000-0000-0000-0000-000000000000",
    "actor_username": "service_role",
    "actor_via_sso": false,
    "log_type": "team",
    "traits": {
      "provider": "email",
      "user_email": "profit1993house@gmail.com",
      "user_id": "f2464918-0261-4fc4-8aff-7aabcf3c0cfe",
      "user_phone": ""
    }
  },
  "component": "api",
  "duration": 266275214,
  "level": "info",
  "method": "POST",
  "msg": "request completed",
  "path": "/admin/users",
  "referer": "http://localhost:3000",
  "remote_addr": "54.78.138.181",
  "request_id": "972abedbb378f410-DUB",
  "status": 200,
  "time": "2025-08-21T14:15:58Z"
}
```

* **Metadata:** (Truncated for brevity)

```json
[
  {
    "host": "db-hoeayddzdrkyluxyoknu",
    "component": "api",
    "msg": "request completed",
    "auth_event": [
      {
        "action": "user_signedup",
        "actor_id": "00000000-0000-0000-0000-000000000000",
        "actor_username": "service_role",
        "log_type": "team",
        "traits": [
          {
            "provider": "email",
            "user_email": "profit1993house@gmail.com",
            "user_id": "f2464918-0261-4fc4-8aff-7aabcf3c0cfe"
          }
        ]
      }
    ],
    "level": "info",
    "path": "/admin/users",
    "status": "200",
    "method": "POST",
    "remote_addr": "54.78.138.181",
    "referer": "http://localhost:3000"
  }
]
```

## Supabase Edge Functions Examples

### File Upload Function

```typescript
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { randomUUID } from 'node:crypto'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

Deno.serve(async (req) => {
  const formData = await req.formData()
  const file = formData.get('file')
  
  // TODO: update your-bucket to the bucket you want to write files
  const { data, error } = await supabase
    .storage
    .from('your-bucket')
    .upload(
      `${file.name}-${randomUUID()}`,
      file,
      { contentType: file.type }
    )
  if (error) throw error
  return new Response(
    JSON.stringify({ data }),
    { headers: { 'Content-Type': 'application/json' }}
  )
})
```

### WebSocket Example

```typescript
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve((req) => {
  const upgrade = req.headers.get("upgrade") || ""
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.")
  }
  const { socket, response } = Deno.upgradeWebSocket(req)
  socket.onopen = () => {
    console.log("client connected!")
    socket.send('Welcome to Supabase Edge Functions!')
  }
  socket.onmessage = (e) => {
    console.log("client sent message:", e.data)
    socket.send(new Date().toString())
  }
  return response
})
```

### Data Fetching Example

```typescript
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // TODO: Change the table_name to your table
    const { data, error } = await supabase.from('table_name').select('*')

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: err?.message ?? err }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500 
    })
  }
})
```

## Experimental API Token

`sbp_v0_ce173831593750e88d364287b5c097ed64d7921a`

## Realtime Channel

* **Channel:** `foodAPP`
* **Role:** `service role`

```json
{
  "id": "babc8c52-cf28-4b3c-be88-ffbf97f58a72",
  "timestamp": 1755787689967,
  "message": "SYSTEM",
  "metadata": {
    "message": "Subscribed to PostgreSQL",
    "status": "ok",
    "extension": "postgres_changes",
    "channel": "foodAPP"
  }
}
```

## NextAuth Secret

`NEXTAUTH_SECRET=@k0bIEKibxfvzndGY`

## Vercel Environment Variables - FoodSyriaApp

### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL=https://hoeayddzdrkyluxyoknu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SUPABASE_SERVICE_ROLE_KEY]
```

### NextAuth Configuration

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=@k0bIEKibxfvzndGY
```

### Database Configuration (for Prisma)

```
DATABASE_URL=postgresql://postgres.hoeayddzdrkyluxyoknu:k0bIEKibxfvzndGY@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.hoeayddzdrkyluxyoknu:k0bIEKibxfvzndGY@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

### Important Notes

1. تأكد من استبدال `[YOUR-PASSWORD]` بكلمة مرور قاعدة البيانات الفعلية
2. قم بتغيير `NEXTAUTH_URL` إلى رابط تطبيقك الفعلي في Vercel
3. قم بإنشاء `NEXTAUTH_SECRET` عشوائي وآمن
4. لا تشارك هذه المفاتيح مع أي شخص