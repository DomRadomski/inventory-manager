require("dotenv").config();

const { Client } = require("pg");

const SQL = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS UserAdmin BOOLEAN NOT NULL DEFAULT FALSE;
`;

async function main() {
    console.log("adding UserAdmin column...");
    const client = new Client({
        connectionString: process.env.AUTH_DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();