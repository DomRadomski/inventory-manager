require("dotenv").config();

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  CatId SERIAL PRIMARY KEY,
  CatName VARCHAR(100) NOT NULL,
  CatDesc TEXT
);

CREATE TABLE IF NOT EXISTS items (
  ItemId SERIAL PRIMARY KEY,
  ItemName VARCHAR(100) NOT NULL,
  ItemDesc TEXT,
  ItemPrice NUMERIC(10, 2) NOT NULL,
  ItemStock INTEGER NOT NULL DEFAULT 0,
  ItemImageUrl TEXT,
  ItemCatId INTEGER REFERENCES categories(CatId) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  UserId SERIAL PRIMARY KEY,
  UserName VARCHAR(255) UNIQUE NOT NULL,
  UserHash TEXT NOT NULL,
  UserSalt TEXT NOT NULL
);

ALTER TABLE categories ADD COLUMN IF NOT EXISTS CatCreatedById INTEGER REFERENCES users(UserId) ON DELETE SET NULL;
ALTER TABLE items ADD COLUMN IF NOT EXISTS ItemCreatedById INTEGER REFERENCES users(UserId) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS session (
  "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
`;

const SEED_SQL = `
INSERT INTO categories (CatName, CatDesc)
VALUES
  ('Shirts', 'Football shirts and jerseys'),
  ('Shorts', 'Match and training shorts'),
  ('Socks', 'Football socks'),
  ('Boots', 'Football boots for all surfaces'),
  ('Footballs', 'Match and training footballs');

INSERT INTO items (ItemName, ItemDesc, ItemPrice, ItemStock, ItemCatId)
VALUES
  ('Home Shirt 25/26', 'Official home shirt, replica fit', 64.99, 40, (SELECT CatId FROM categories WHERE CatName = 'Shirts')),
  ('Away Shirt 25/26', 'Official away shirt, replica fit', 64.99, 35, (SELECT CatId FROM categories WHERE CatName = 'Shirts')),
  ('Training Shorts', 'Lightweight training shorts', 24.99, 50, (SELECT CatId FROM categories WHERE CatName = 'Shorts')),
  ('Match Shorts', 'Official match day shorts', 29.99, 30, (SELECT CatId FROM categories WHERE CatName = 'Shorts')),
  ('Match Socks', 'Official team socks', 12.99, 60, (SELECT CatId FROM categories WHERE CatName = 'Socks')),
  ('Grip Socks', 'Anti-slip grip socks', 14.99, 45, (SELECT CatId FROM categories WHERE CatName = 'Socks')),
  ('Firm Ground Boots', 'Boots for firm natural surfaces', 89.99, 20, (SELECT CatId FROM categories WHERE CatName = 'Boots')),
  ('Astro Turf Trainers', 'Boots for artificial turf', 74.99, 25, (SELECT CatId FROM categories WHERE CatName = 'Boots')),
  ('Match Ball Size 5', 'Official size 5 match ball', 39.99, 30, (SELECT CatId FROM categories WHERE CatName = 'Footballs')),
  ('Training Ball Size 5', 'Durable training ball', 19.99, 40, (SELECT CatId FROM categories WHERE CatName = 'Footballs')),
  ('Gift Voucher', '£20 in-store gift voucher', 20.00, 100, NULL),
  ('Club Keyring', 'Official club keyring', 4.99, 75, NULL);
`;

async function main() {
  console.log("setting up schema...");
  const client = new Client({
    connectionString: process.env.AUTH_DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);

  const { rows } = await client.query("SELECT COUNT(*) FROM categories");
  if (Number(rows[0].count) === 0) {
    console.log("seeding categories/items...");
    await client.query(SEED_SQL);
  } else {
    console.log("categories already seeded, skipping seed data");
  }

  await client.end();
  console.log("done");
}

main();