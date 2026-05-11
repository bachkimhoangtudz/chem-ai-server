const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Server OK");
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
                    content: "Bạn là ChemAI."
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        res.json({
            reply:
                completion.choices[0]
                .message.content
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            reply: "AI Error"
        });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Running on " + PORT);
});
