import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config();

const app = express();

const port = 8080;

const URI = process.env.MONGO_URI;

app.use(cors());

// ✅ Add this BEFORE your routes
app.use(express.json());  // <-- very important!
app.use(express.urlencoded({ extended: true })); // Optional, good for form data

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const start = async () => {
    await mongoose.connect(URI)
        .then(() => {
            console.log("DB connected");
        })
        .catch((e) => {
            console.log("Error in Db connect", e);
        });

    app.listen(port, () => {
        console.log("port is listining on", port);
    });
}

start();


