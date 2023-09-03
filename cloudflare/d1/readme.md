## Create new DB
`wrangler d1 create metamapper`

## Create schema for existing DB
`wrangler d1 execute metamapper --local --file=./cloudflare/d1/schema.sql`

## Query with wrangler 
`wrangler d1 execute metamapper --local --command='SELECT * FROM BackendTracking'`
