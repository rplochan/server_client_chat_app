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

export const getChatHistory = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const otherUserId = req.params.userId;

        const result = await pool.query(
            `SELECT id, sender_id, receiver_id, content, created_at
             FROM messages
             WHERE
                 (sender_id = $1 AND receiver_id = $2)
                 OR
                 (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC`,
            [currentUserId, otherUserId]
        );

        res.json({
            messages: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};