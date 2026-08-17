import pool from "../config/db.js";

export const sendMessage =  async (req, res) => {

    try {
        const {receiver_id, content} = req.body;
        const sender_id = req.user.userId;

        await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, content) 
             VALUES($1 , $2 , $3)`,
             [sender_id, receiver_id, content]
        );

        res.status(201).json({
            message: "Message sent successfully."
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
}