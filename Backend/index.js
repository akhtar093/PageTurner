import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ MUST come before all other imports that might use env
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("__dirname", __dirname);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT;
const URI = process.env.MongoDBURI;

// Debug environment variables
console.log("Environment variables:");
console.log("PORT:", process.env.PORT);
console.log("MongoDBURI:", process.env.MongoDBURI);
console.log("Using URI:", URI);

// connect to mongoDB
mongoose.connect(URI)
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error: ", error.message);
        console.log("Please make sure MongoDB is running on localhost:27017");
    });

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server is listening on port=> ${PORT}`);
    console.log(`Frontend should connect to: http://localhost:${PORT}`);
});