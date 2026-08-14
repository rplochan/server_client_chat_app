import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        // take the json format data form the user.. POST req.
        const { username, email, password } = req.body;


        if (!username || !email || !password) {
            return res.status(400).json({
              message: "All fields are required"
            });
        }

        // check if the email is already present
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // hash the password.
        const passwordHash = await bcrypt.hash(password, 10);

        // insert in database.
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

        // create a jwt token.
        const token = jwt.sign(
            {
                userId : user.id,
                email : user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "1h"
            }
        )


        res.json({
            message: "Login successful",
            token: token,
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
