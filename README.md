# wishlist_back

## How to setup

### Install
1. `git clone https://github.com/Plush-Engineers/wishlist_back`
2. `cd wishlist_back`
3. Create `.env` file in the root and fill it with [environment variables](#environment-variables)

### Start (development)

1. `docker-compose up -d postgres`
2. `docker-compose up -d pgadmin` (optional)
3. `npm run start:dev`

### Build (production)

1. `docker-compose up -d postgres` (to run database)
2. `docker-compose up -d` (to run everything else)


## Environment variables

Values provided in repo's `.env` are just examples, real `.env` should be hidden from everyone.

### Database
- `DB_HOST`: hostname of the machine that provides postgres (like `127.0.0.1`)
- `DB_PORT`: port of the postgres (like `5432`)
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: credentials for postgres

### Authentication
- `JWT_SECRET`: secret for JWT auth service (like `KGJsg4jd3kgjsdlgk`)
- `JWT_EXPIRATION_TIME`: time for JWT token to expire (like `2d`)


### Other
- `CORS_ALLOWED_ORIGIN`: allowed origin (frontend) protected with CORS (like `https://yourdomain.com`)
