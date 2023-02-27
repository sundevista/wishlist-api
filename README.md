# wishlist_back

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
