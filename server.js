const express = require("express");
const cors = require("cors");
require("dotenv").config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        const completion =
            await client.chat.completions.create({

            model: "gpt-4.1-mini",

            messages: [
                {
                    role: "system",
                    content: `
                    Bạn là ChemAI.
                    Trợ lý hóa học chuyên giải bài tập,
                    phản ứng hóa học và kiến thức THPT.
                    `
                },

                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        res.json({
            reply: completion.choices[0]
                .message.content
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            reply: "Lỗi AI server"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running");
});