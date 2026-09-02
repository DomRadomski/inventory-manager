// db/queries/userQueries.js
const pool = require("./pool");

const User = {
    async create(username, hash, salt) {
        const result = await pool.query(
            "INSERT INTO users (username, userhash, usersalt) VALUES ($1, $2, $3) RETURNING *",
            [username, hash, salt]
        );
        return result.rows[0];
    },

    async findByUsername(username) {
        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await pool.query(
            "SELECT * FROM users WHERE userid = $1",
            [id]
        );
        return result.rows[0];
    }
};

module.exports = User;