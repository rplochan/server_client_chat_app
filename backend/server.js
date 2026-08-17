import express from "express"  // imports the express framework.
import cors from "cors"    // imports CORS middleware so browsers can access ur backend.
import dotenv from "dotenv"


dotenv.config(); // loads the env variables from .env

const app = express();     // creates the express application.
const PORT = process.env.PORT || 3000;

// middleware..
app.use(cors());          // creates the cors middleware
app.use(express.json());   // parsers the incoming JSON req bodies

app.get("/" , (req, res) => {
    res.send("Chat backend running");
});

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}.`);
});


import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/messages", messageRoutes);

app.use("/api/auth", authRoutes);

