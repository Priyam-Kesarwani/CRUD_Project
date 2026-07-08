CREATE DATABASE nest_auth;

-- TypeORM synchronize will create the users table automatically.
-- Reference schema:
--
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR NOT NULL UNIQUE,
--   name VARCHAR NOT NULL,
--   password_hash VARCHAR NOT NULL,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );
