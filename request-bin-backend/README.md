# Webhook Gravity Well

<h3>Backend Setup</h3>
1. run `createdb rhh`
2. import the schema into the db `psql -d rhh < schema.sql`
3. ensure both psql is running on default port
4. ensure mongodb is running on default port ([ubuntu guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#std-label-install-mdb-community-ubuntu))
4. **Erik only**: Modify `CONNECTION` object in `services/psql.ts` to include username for psql authentication
5. **If using Postman locally**: manually insert a bin called `localhost:3001` into the `bins` table

**MVP:**

- Create a bin endpoint URL
- Create a bin view URL
- Receive payloads from webhooks
- View payloads

**Core Requirements:**

1. pretty front-end
2. websocket support to page refresh
3. user authentication OR store session_id in cookie so user can come back and see previously created bin

**Nice-to-haves:**

- delete entries
- Add a cron job to clean up database if the endpoint is dormant
- Search webhooks
- Visualize / Pretty mode for payload

**Considerations**

- webhook sends null value: include null value or empty payload guard?
- Headers are included in payload - relevant HTTP headers to parse?
- serial the correct data type for PKs?
- advantages/disadvantages of tying bins to account, IP address, cookie
- **build core functionality first,** then decide
- TTL for bins?? what's reasonable?
  - bins only have a lifetime of 14 days
  - bins deleted after being "dormant" for 14 days
    - define "dormant" as time since they received their last payload
    - or "dormant" from last time they requested their bin view URL
- use subdomain for bin URL and use path for bin view URL?
- use mongoDB atlas or mongoDB community edition
- use ORM or write SQL statements directly?
  - simple ERD, so favor direct SQL queries
- API private vs public
  - securing your API endpoints with HTTP authorization token
- To create a new bin
  - nginx server block location block pattern-matched DNS entry to redirect to correct bin
