import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if email already exists
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    console.log(result.rows);

    if (result.rows.length > 0) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
     await pool.query(
        `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)`,
        [username, email, passwordHash]
    );

    res.status(201).json({
        message: "User registered successfully"
    });
};