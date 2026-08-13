import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
              message: "All fields are required"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

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

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and Password are required."
            })
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if(result.rows.length === 0){
            return res.status(401).json({
                message : "Invalid email or password."
            });
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id : user.id,
                username : user.username,
                email : user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message : "Server error"
        });
    }
};
