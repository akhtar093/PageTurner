import Book from "../model/book.model.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getBook = async (req, res) => {
    try {
        const book = await Book.find();
        if (book.length === 0) {
            // If no books in DB, load from lists/books.json
            const filePath = path.join(__dirname, "../lists/books.json");
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, "utf-8");
                let booksList = JSON.parse(data);
                // Map to match MongoDB format
                booksList = booksList.map(book => {
                    const { id, ...rest } = book;
                    return {
                        _id: `offline-${id}`,
                        ...rest,
                        __v: 0
                    };
                });
                return res.status(200).json(booksList);
            } else {
                return res.status(404).json({ message: "No books found in DB or lists/books.json" });
            }
        }
        console.log("my books", book);
        res.status(200).json(book);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
};