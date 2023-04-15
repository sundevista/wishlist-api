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

You can use `.env.example` to create your `.env` file.
